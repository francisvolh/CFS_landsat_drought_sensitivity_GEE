/*
Vegetation
Alec L. Robitaille
*/


var get_canopy_height = function() {
  var ch = ee.ImageCollection("projects/sat-io/open-datasets/carbon_stocks_ca/ch");
  
  return ch.toBands()
           .rename(['ch_85perc_height_250m_b1', 
                    'ch_95perc_height_250m_b1',
                    'ch_max_height_250m_b1'],
                   ['ch_85perc_height_250m', 
                    'ch_95perc_height_250m',
                    'ch_max_height_250m']);
};
exports.get_canopy_height = get_canopy_height;

