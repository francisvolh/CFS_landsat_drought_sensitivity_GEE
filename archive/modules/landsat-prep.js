// Landsat 5 and 7 prep

// B1 Band 1 (blue) surface reflectance
// B2 Band 2 (green) surface reflectance
// B3 Band 3 (red) surface reflectance
// B4 Band 4 (near infrared) surface reflectance
// B5 Band 5 (shortwave infrared 1) surface reflectance
// B6 Band 6 brightness temperature.
// B7 Band 7 (shortwave infrared 2) surface reflectance

// Normalized difference indices
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('SR_B3'),
                    nir: img.select('SR_B4')})
       .rename('NDVI'),
     img.expression('(nir - swir2) / (nir + swir2)',
                   {nir: img.select('SR_B4'),
                    swir2: img.select('SR_B7')})
       .rename('NBR'),
     img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
                   {blue: img.select('SR_B1'),
                    red: img.select('SR_B3'),
                    nir: img.select('SR_B4')})
       .rename('EVI'),
     img.select('QA_PIXEL')
  ]).copyProperties(img).set({'system:time_start': img.date().millis()});
};


// Mask clouds and rescale images, from EE docs
exports.maskL457sr = function(image) {
  // Bit 0 - Fill
  // Bit 1 - Dilated Cloud
  // Bit 2 - Unused
  // Bit 3 - Cloud
  // Bit 4 - Cloud Shadow
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);

  // Apply the scaling factors to the appropriate bands.
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBand = image.select('ST_B6').multiply(0.00341802).add(149.0);

  // Replace the original bands with the scaled ones and apply the masks.
  return image.addBands(opticalBands, null, true)
      .addBands(thermalBand, null, true)
      .updateMask(qaMask)
      .updateMask(saturationMask);
};


// Set year
exports.setYear = function(img) {
  return img.set('year', img.date().get('year'));
};

// Aggregate years
exports.aggregateY = function(images) {
  var years = images.aggregate_array('year').distinct();
  // Combine images returned for each year
  return ee.ImageCollection.fromImages(
    // Map over years
    years.map(function(yr) {
      // Filter images to year
      // Reduce with reducer provided
      // Set year and pseudo date properties
      // Return an image for each year
      return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                   .reduce(ee.Reducer.mean())
                   .set('year', yr)
                   .set('system:time_start', ee.Date.fromYMD(yr, 7, 1).millis());
    })
  );
};
