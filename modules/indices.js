// Normalized difference indices
// Landsat 5
// B1 	Band 1 (blue) surface reflectance
// B2 	Band 2 (green) surface reflectance
// B3 	Band 3 (red) surface reflectance
// B4 	Band 4 (near infrared) surface reflectance
// B5 	Band 5 (shortwave infrared 1) surface reflectance
// B6 	Band 6 brightness temperature. Resampled using cubic convolution to 30m.
// B7 	Band 7 (shortwave infrared 2) surface reflectance
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('B4'),
                    nir: img.select('B3')})
       .rename('NDVI'),
     img.expression('(nir - swir) / (nir + swir)',
                   {nir: img.select('B4'),
                    swir: img.select('B7')})
       .rename('NBR'),
     img.expression('2.5 * ((nir – red) / (nir + 6 * red – 7.5 * blue + 1))',
                   {blue: img.select('B1'),
                    red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('EVI'),
  ]);
};
