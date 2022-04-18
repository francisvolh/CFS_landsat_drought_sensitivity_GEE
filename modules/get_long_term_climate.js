/*
Long term climate from Daymet
Alec L. Robitaille

Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton, S. Kao, and B.E. Wilson.
{YEAR}. Daymet: Daily Surface Weather Data on a 1-km Grid for North America,
Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA

Other Citation Details - Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton,
S. Kao, and B.E. Wilson. 2020. Daymet: Daily Surface Weather Data on a 1-km
Grid for North America, Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA.
doi:10.3334/ORNLDAAC/1840
*/


// Load modules
var utils = require('users/robitalec/CFS:modules/utils.js');

// Load Daymet
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4");

// Reducer
var reducer = ee.Reducer.mean().combine(ee.Reducer.sum(), null, true);

// Get long term climate
var get_long_term_climate = function(year_list) {
  var annual = utils.aggregrate_year(daymet, year_list, reducer)
                    .select(['tmin_mean', 'tmax_mean', 'prcp_sum'], 
                            ['tmin', 'tmax', 'prcp']);
  var tmean = annual.map(function(img) {
    return img.addBands([img.select(['tmin', 'tmax'])
                            .reduce(ee.Reducer.mean())
                            .rename('tmean')]);
  });
  return annual.reduce(ee.Reducer.mean());
};
exports.get_long_term_climate = get_long_term_climate;
