/*
Generates a Daymet collection
Alec L. Robitaille

Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton, S. Kao, and B.E. Wilson.
{YEAR}. Daymet: Daily Surface Weather Data on a 1-km Grid for North America,
Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA

Other Citation Details - Thornton, M.M., R. Shrestha, Y. Wei, P.E. Thornton,
S. Kao, and B.E. Wilson. 2020. Daymet: Daily Surface Weather Data on a 1-km
Grid for North America, Version 4. ORNL DAAC, Oak Ridge, Tennessee, USA.
doi:10.3334/ORNLDAAC/1840
*/


// Load utils modules
var utils = require('users/robitalec/CFS:modules/utils.js');

// Load Daymet
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V4")
	.filterDate('1980-01-01', '2020-01-01');

// Get collection of Daymet images
var get_monthly_daymet = function(year_list, month_list, reducer) {
	return utils.aggregate_month_year(daymet, year_list, month_list, reducer);
}
exports.get_monthly_daymet = get_monthly_daymet;

// Prep Daymet for CMI
// exports.prepDaymet = function(minyear, maxyear) {
//   // Set list of years and months
//   var months = ee.List.sequence(1, 12);
//   var years = ee.List.sequence(minyear, maxyear);

//   // Reducer
//   // Combine both mean and sum reducers
//   var reducer = ee.Reducer.mean().combine(ee.Reducer.sum(), null, true);

//   // Filter daymet within years
//   var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V3")
//     .filter(ee.Filter.calendarRange(minyear, maxyear, 'year'));

//   // Aggregate monthly for each year
//   // Using reducer
//   var aggDaymet = agg.aggregateMY(years, months, daymet, reducer);

//   // Only keep tmin tmax mean and prcp sum
//   aggDaymet = aggDaymet.select(['tmin_mean', 'tmax_mean', 'prcp_sum'],
//                               ['tmin', 'tmax', 'prcp']);

//   return aggDaymet
// }
