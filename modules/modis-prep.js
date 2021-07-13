// MODIS prep


exports.rescale = function(img) {
  return img.multiply(0.0001).copyProperties(img);
};


//float?
