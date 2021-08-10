// MODIS prep


exports.rescale = function(img) {
  return img.multiply(0.0001)
            .float()
            .copyProperties(img)
            .set('system:time_start', img.get('system:time_start'));
};


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