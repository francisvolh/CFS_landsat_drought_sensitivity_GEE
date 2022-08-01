/*
Vegetation
Alec L. Robitaille
*/


var get_canopy_height = function() {
  var ch = ee.ImageCollection("projects/sat-io/open-datasets/carbon_stocks_ca/ch");
  
  return ch.toBands();
};
exports.get_canopy_height = get_canopy_height;

