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


// TODO: monthly_daymet

var weekly_daymet = function(daymet_col, year_list, week_list) {
  var reducer = ee.Reducer.min().combine(ee.Reducer.max(), null, true);
  var agg_wk = utils.aggregrate_week(daymet_col, year_list, week_list, reducer);
  return agg_wk;

};
exports.weekly_daymet = weekly_daymet;



var temp_annual_mean = function(weekly_daymet) {
  var weekly_means = weekly_daymet.map(function(image) {
    return image.select(['tmax_max'])
                .add(image.select(['tmin_min']))
                .divide(2)
                .rename(['temp_annual_mean'])
                .copyProperties(image);
  });

  var temp_ann_mean = weekly_means.mean();

  return temp_ann_mean;
};
exports.temp_annual_mean = temp_annual_mean;



var temp_annual_range = function(weekly_daymet) {
  var weekly_max = weekly_daymet.select(['tmax_max']).max();
  var weekly_min = weekly_daymet.select(['tmin_min']).min();

  return ee.Image(weekly_max.subtract(weekly_min)
                            .rename(['temp_annual_range'])
                            .copyProperties(weekly_max));
};
exports.temp_annual_range = temp_annual_range;



var sampling_collection = function() {
  var years = ee.List.sequence(vars.min_year, vars.max_year);
  var weekly_daymet = weekly_daymet(daymet(), vars.years, vars.weeks);
  
  return ee.Image([
    temp_annual_mean(weekly_daymet),
    temp_annual_range(weekly_daymet)
    ]);
};
exports.sampling_collection = sampling_collection;


