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
var vars = require('users/robitalec/CFS:modules/variables.js');


var daymet = function() {
  var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4");
  daymet = daymet.filter(ee.Filter.calendarRange(vars.min_year, vars.max_year, 'year'))
                 .map(utils.set_date)
                 .map(utils.set_week)
                 .map(utils.set_year);

  return daymet;
};
exports.daymet = daymet;



var weekly_daymet = function(daymet_col, year_list, week_list) {
  var reducer = ee.Reducer.min().combine(ee.Reducer.max(), null, true);
  var agg_wk = utils.aggregrate_week(daymet_col, year_list, week_list, reducer);
  return agg_wk;

};
exports.weekly_daymet = weekly_daymet;



var annual_mean_temp = function(weekly_daymet) {
  var weekly_means = weekly_daymet.map(function(image) {
    return image.select(['tmax_max'])
                .add(image.select(['tmin_min']))
                .divide(2)
                .rename(['annual_mean_t'])
                .copyProperties(image);
  });
  
  var annual_mean_t = weekly_means.mean();

  return annual_mean_t;
};
exports.annual_mean_temp = annual_mean_temp;



// TODO: monthly_daymet


