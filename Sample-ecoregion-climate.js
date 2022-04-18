// Load modules
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set variables
var years = ee.List.sequence(1985, 2020);


var mean_annual_daymet = get_daymet.get_mean_annual(years);
// print(mean_annual_daymet)
mean_annual_daymet = mean_annual_daymet.select(['prcp_mean_mean', 'tmax_mean_mean', 'tmin_mean_mean'])

var ft = ee.FeatureCollection('users/robitalec/CFS/reverse-eco-points')

ft = ft.randomColumn()
       .filter(ee.Filter.lt('random', 0.01))

var sample = ft.map(function(f) { 
  return mean_annual_daymet.sampleRegions(f, null, 1000)
}).flatten()

// print(sample)
 
// var sample = mean_annual_daymet.sampleRegions(ft, null, 1000)

Export.table.toDrive(sample, 'subsample-reverse-long-term')