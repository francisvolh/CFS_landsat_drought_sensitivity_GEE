/*
Vegetation
Alec L. Robitaille



Sothe, C., Gonsamo, A., Arabian, J., Kurz, W. A., Finkelstein, S. A., & Snider, J. (2022).
Large soil carbon storage in terrestrial ecosystems of Canada.
Global Biogeochemical Cycles, 36, e2021GB007213. https://doi.org/10.1029/2021GB007213

https://samapriya.github.io/awesome-gee-community-datasets/projects/scs


Maltman, J.C., Hermosilla, T., Wulder, M.A., Coops, N.C., White, J.C., 2023. Estimating and mapping forest age across Canada’s forested ecosystems.
Remote Sensing of Environment 290, 113529.

https://gee-community-catalog.org/projects/ca_fa/

*/

// Load modules
var fire = require('users/robitalec/CFS:modules/fire.js');



var canopy_height = function() {
  var ch = ee.ImageCollection("projects/sat-io/open-datasets/carbon_stocks_ca/ch");
  
  return ch.toBands()
           .select(['ch_85perc_height_250m_b1', 
                    'ch_95perc_height_250m_b1',
                    'ch_max_height_250m_b1'],
                   ['ch_85perc_height_250m', 
                    'ch_95perc_height_250m',
                    'ch_max_height_250m']);
};
exports.canopy_height = canopy_height;



var forest_carbon = function() {
  console.log('warning: Sothe forest carbon data may be out of date');
  var fc = ee.ImageCollection("projects/sat-io/open-datasets/carbon_stocks_ca/fc")
    .toBands()
    .select(['fc_250m_version10_b1'],
            ['forest_carbon_250m_version10']);
            
  return fc;
};
exports.forest_carbon = forest_carbon;



var forest_age = function() {
  var age = ee.Image("projects/sat-io/open-datasets/CA_FOREST/CA_forest_age_2019")
      .select(['b1'], ['CA_forest_age']);
  return age;
};
exports.forest_age = forest_age;


var sampling_collection = function() {
  return ee.Image([
    canopy_height(),
    forest_carbon(),
    forest_age(),
    fire.sum_burned_buffer(500)
  ]);
};
exports.sampling_collection = sampling_collection;