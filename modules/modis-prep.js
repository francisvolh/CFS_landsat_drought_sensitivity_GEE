// MODIS prep


// For MOD09A1
// Name 	        Description 	                  (band) 	Wavelength    Scale
// sur_refl_b01 	Surface reflectance for band 1  Red 		620-670nm   	0.0001
// sur_refl_b02 	Surface reflectance for band 2 	NIR 		841-876nm   	0.0001
// sur_refl_b03 	Surface reflectance for band 3 	Blue 		459-479nm   	0.0001
// sur_refl_b04 	Surface reflectance for band 4 	Green 	545-565nm   	0.0001
// sur_refl_b05 	Surface reflectance for band 5 	NIR  		1230-1250nm 	0.0001
// sur_refl_b06 	Surface reflectance for band 6 	SWIR 		1628-1652nm 	0.0001
// sur_refl_b07 	Surface reflectance for band 7 	SWIR 		2105-2155nm 	0.0001
// QA 	Surface reflectance 500m band quality control flags
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('sur_refl_b01'),
                    nir: img.select('sur_refl_b02')})
       .rename('NDVI'),
     img.expression('(nir - swir2) / (nir + swir2)',
                   {nir: img.select('sur_refl_b01'),
                    swir2: img.select('sur_refl_b07')})
       .rename('NBR'),
     img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
                   {blue: img.select('sur_refl_b03'),
                    red: img.select('sur_refl_b01'),
                    nir: img.select('sur_refl_b02')})
       .rename('EVI'),
     img.select('StateQA')
  ]).copyProperties(img).set({'system:time_start': img.date().millis()});
};


exports.rescale = function(img) {
  return ee.Image([
    img.select('sur_refl_b01').multiply(0.0001),
    img.select('sur_refl_b02').multiply(0.0001),
    img.select('sur_refl_b03').multiply(0.0001),
    img.select('sur_refl_b04').multiply(0.0001),
    img.select('sur_refl_b05').multiply(0.0001),
    img.select('sur_refl_b06').multiply(0.0001),
    img.select('sur_refl_b07').multiply(0.0001),
    img.select('QA'),
    img.select('StateQA')
  ]).copyProperties(img)
    .set({'system:time_start': img.get('system:time_start')})
    .set('year', img.date().get('year'));
};


// from ee docs
exports.maskClouds = function(image) {
  // Select the QA band.
  var QA = image.select('StateQA')
  // Make a mask to get bit 10, the internal_cloud_algorithm_flag bit.
  var bitMask = 1 << 10;
  // Return an image masking out cloudy areas.
  return image.updateMask(QA.bitwiseAnd(bitMask).eq(0))
}


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
