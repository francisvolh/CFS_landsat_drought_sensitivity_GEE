// MODIS prep


exports.rescale = function(img) {
  return img.multiply(0.0001).float().copyProperties(img);
};


//float?
