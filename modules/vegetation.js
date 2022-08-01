/*
Vegetation
Alec L. Robitaille
*/


var get_canopy_height = function() {
  return ee.ImageCollection("projects/sat-io/open-datasets/carbon_stocks_ca/ch");
};
exports.get_canopy_height = get_canopy_height;

