/*
Climate
Alec L. Robitaille

Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton, S. Kao, and B.E. Wilson.
{YEAR}. Daymet: Daily Surface Weather Data on a 1-km Grid for North America,
Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA

Other Citation Details - Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton,
S. Kao, and B.E. Wilson. 2020. Daymet: Daily Surface Weather Data on a 1-km
Grid for North America, Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA.
doi:10.3334/ORNLDAAC/1840


Using ANUCLIM formulas
https://fennerschool.anu.edu.au/files/anuclim61.pdf

*/


// Load modules
var utils = require('users/robitalec/CFS:modules/utils.js');



var daymet = function() {
  var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4");
  daymet = daymet.map(utils.set_date)           
                 .map(utils.set_week)
                 .map(utils.set_year);
                 
  return daymet;
};
exports.daymet = daymet;



var weekly_daymet = function(daymet, year_list) {
  var daymet_col = daymet();
  
  var reducer = ee.Reducer.min().combine(ee.Reducer.max(), null, true);
  
  var agg_wk = utils.aggregrate_week(daymet_col, year_list, reducer);
  
  return agg_wk;
  
};
exports.weekly_daymet = weekly_daymet;





// TODO: monthly_daymet



// // Get long term climate
// var long_term_climate = function(year_list) {
//   var annual = utils.aggregrate_year(daymet, year_list, reducer)
//                     .select(['tmin_mean', 'tmax_mean', 'prcp_sum'],
//                             ['tmin', 'tmax', 'prcp']);
//   annual = annual.map(function(img) {
//     return img.addBands([img.select(['tmin', 'tmax'])
//                             .reduce(ee.Reducer.mean())
//                             .rename('tmean')]);
//   });
//   return annual.reduce(ee.Reducer.mean());
// };
// exports.long_term_climate = long_term_climate;
