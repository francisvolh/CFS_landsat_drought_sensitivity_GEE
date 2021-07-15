// Landsat 5 and 7 prep

// B1 	Band 1 (blue) surface reflectance
// B2 	Band 2 (green) surface reflectance
// B3 	Band 3 (red) surface reflectance
// B4 	Band 4 (near infrared) surface reflectance
// B5 	Band 5 (shortwave infrared 1) surface reflectance
// B6 	Band 6 brightness temperature.
// B7 	Band 7 (shortwave infrared 2) surface reflectance

// Normalized difference indices
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('NDVI'),
     img.expression('(nir - swir2) / (nir + swir2)',
                   {nir: img.select('B4'),
                    swir2: img.select('B7')})
       .rename('NBR'),
     img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
                   {blue: img.select('B1'),
                    red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('EVI'),
     img.select('pixel_qa')
  ]).copyProperties(img).set({'system:time_start': img.date().millis()});
};


// from l5, l7 ee docs
exports.maskClouds = function(image) {
  var qa = image.select('pixel_qa');
  // If the cloud bit (5) is set and the cloud confidence (6) is high
  // or the cloud shadow bit is set (3), then it's a bad pixel.
  var cloud = qa.bitwiseAnd(1 << 5)
                  .and(qa.bitwiseAnd(1 << 6))
                  .or(qa.bitwiseAnd(1 << 3));
  // Remove edge pixels that don't occur in all bands
  var mask2 = image.mask().reduce(ee.Reducer.min());
  return image.updateMask(cloud.not()).updateMask(mask2);
};


var water = ee.Image("JRC/GSW1_3/GlobalSurfaceWater")
                    .select('occurrence')
                    .gt(0.7);
exports.maskWater = function(image) {
  return image.updateMask(water.not());
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


exports.rescale = function(img) {
  return ee.Image([
    img.select('B1').multiply(0.0001),
    img.select('B2').multiply(0.0001),
    img.select('B3').multiply(0.0001),
    img.select('B4').multiply(0.0001),
    img.select('B5').multiply(0.1),
    img.select('B6').multiply(0.0001),
    img.select('B7').multiply(0.0001),
    img.select('sr_atmos_opacity').multiply(0.001),
    img.select('sr_cloud_qa'),
    img.select('pixel_qa'),
    img.select('radsat_qa')
  ]).copyProperties(img);
};