var calc_vci = function(images) {
  var band = 'NDVI';
  var max = images.select(band).max();
  var min = images.select(band).min();
  
  return images.map(function(img) {
    // VCI = ((NDVI - NDVI min) X 100) / (NDVI max - NDVI min)
    return img.addBands([
      img.expression('VCI = ((NDVI - min) * 100) / (max - min) ', {
        NDVI: img.select(band),
        max: max,
        min: min
      })
    ]);
  });
};
exports.calc_vci = calc_vci;