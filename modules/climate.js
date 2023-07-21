/*
Climate
Alec L. Robitaille

Daymet

Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton, S. Kao, and B.E. Wilson.
{YEAR}. Daymet: Daily Surface Weather Data on a 1-km Grid for North America,
Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA

Other Citation Details - Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton,
S. Kao, and B.E. Wilson. 2020. Daymet: Daily Surface Weather Data on a 1-km
Grid for North America, Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA.
doi:10.3334/ORNLDAAC/1840

Using ANUCLIM formulas
https://fennerschool.anu.edu.au/files/anuclim61.pdf


Climate NA

Wang, T., A. Hamann, D. Spittlehouse, C. Carroll. 2016. Locally Downscaled and Spatially Customizable Climate Data
for Historical and Future Periods for North America. PLoS One 11(6): e0156720.

AdaptWest Project. 2021. Gridded current and projected climate data for North America at 1km resolution,
generated using the ClimateNA v7.01 software (T. Wang et al., 2021). Available at adaptwest.databasin.org.


*/


// Load modules
var utils = require('users/robitalec/CFS:modules/utils.js');
var vars = require('users/robitalec/CFS:modules/variables.js');


var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4");

var get_daymet = function() {
  daymet = daymet.filter(ee.Filter.calendarRange(vars.min_year_daymet, vars.max_year, 'year'))
                  .map(utils.set_date)
                  .map(utils.set_week)
                  .map(utils.set_year);

  return daymet;
};
exports.daymet = daymet;



var weekly_daymet = function(daymet_col, year_list, week_list) {
  var reducer = ee.Reducer.min()
    .combine(ee.Reducer.max(), null, true)
    .combine(ee.Reducer.sum(), null, true);
  var agg_wk = utils.aggregrate_week(daymet_col, year_list, week_list, reducer);
  return agg_wk;

};
exports.weekly_daymet = weekly_daymet;



var monthly_daymet = function(year_list, month_list) {
  var reducer = ee.Reducer.mean().combine(ee.Reducer.sum(), null, true);

	return utils.aggregate_month_year(daymet, year_list, month_list, reducer)
							.select(['tmin_mean', 'tmax_mean', 'prcp_sum'], ['tmin', 'tmax', 'prcp']);
};
exports.monthly_daymet = monthly_daymet;



var climate_normals = function(bioclim_variables) {
  var bioclim_normals = ee.ImageCollection("projects/sat-io/open-datasets/CMIP6-scenarios-NA/Climate-Normals_bioclim");

  bioclim_normals = bioclim_normals
    .filter(ee.Filter.inList('bioclim_variable', bioclim_variables))
    .filter(ee.Filter.date('1990-01-01','2020-12-31'))
    .toBands();

  return bioclim_normals;
};
exports.climate_normals = climate_normals;



var sampling_collection = function() {
  return climate_normals(['TD', 'MAT', 'MAP', 'MSP', 'CMI']);
};
exports.sampling_collection = sampling_collection;