// Modules ----------------------------------------------------------
var agg = require('users/robitalec/CFS:modules/aggregate.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var baseline = require('users/robitalec/CFS:modules/baseline.js');

// Data -------------------------------------------------------------
// DAYMET
var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V3");

// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));


// Aggregate --------------------------------------------------------
// Filter
var minyear = 1980;
var maxyear = 2019;

daymet = daymet
  .filter(ee.Filter.calendarRange(minyear, maxyear, 'year'));

// List of years and months
var months = ee.List.sequence(1, 12);
var years = ee.List.sequence(minyear, maxyear);

// Reducer
var reducer = ee.Reducer.mean()
  .combine(ee.Reducer.sum(), null, true);

// Aggregate monthly for each year
var aggDaymet = agg.aggregateMY(years, months, daymet, reducer);

// Calculate CMI ----------------------------------------------------
aggDaymet = aggDaymet.select(['tmin_mean', 'tmax_mean', 'prcp_sum'],
                             ['tmin', 'tmax', 'prcp']);

aggDaymet = aggDaymet
  .map(cmi.calcETMAX)
  .map(cmi.calcETMIN)
  .map(cmi.calcETDEW)
  .map(cmi.calcVPD)
  .map(cmi.calcTAVG515)
  .map(cmi.calcKTRF)
  .map(cmi.calcPET)
  .map(cmi.calcCMI);


// Calculate baseline -----------------------------------------------
var means = baseline.antecedentMeans(aggDaymet, 'CMI', years);
var drought = baseline.gtPercentile(means, [5, 10]);
drought = drought.filter(ee.Filter.neq('year', 1980));
// s2Sr_Total = s2Sr_Total.select(['^B[0-9A]+', '^QA[0-9]+'])


// Map --------------------------------------------------------------
// Map.addLayer(drought.filter(ee.Filter.eq('year', 1990))
//                     .select('CMI_gt_ante3_p10'), null, '1990');

// Map.addLayer(drought.filter(ee.Filter.eq('year', 2000))
//                     .select('CMI_gt_ante3_p10'), null, '2000');

// Map.addLayer(drought.filter(ee.Filter.eq('year', 2010))
//                     .select('CMI_gt_ante3_p10'), null, '2010');

// Map.addLayer(drought.filter(ee.Filter.eq('year', 2019))
//                     .select('CMI_gt_ante3_p10'), null, '2019');

// Animate ----------------------------------------------------------
var animation = require('users/gena/packages:animation');

// var animated = drought.map(function(img) {
//   return img.select('CMI_gt_ante3_p10')
//             .visualize({min: 0, max: 1})
//             .set('yearstring', ee.String(img.get('year')));
// });
// var animated = drought.map(function(img) {
//   return img.select('CMI_gt_ante6_p10')
//             .visualize({min: 0, max: 1})
//             .set('yearstring', ee.String(img.get('year')));
// });
var animated = drought.map(function(img) {
  return img.select('CMI_gt_ante12_p10')
            .visualize({min: 0, max: 1})
            .set('yearstring', ee.String(img.get('year')));
});

// var cmi567 = ee.ImageCollection.fromImages(
//   years.map(function(yr) {
//       return aggDaymet.filter(ee.Filter.eq('year', yr))
//                       .filter(ee.Filter.rangeContains('month', 5, 7))
//                       .select('CMI')
//                       .reduce(ee.Reducer.mean())
//                       .visualize({min: -40, max: 40, palette: ["ff0000","ffffff","0008ff"]})
//                       .set('yearstring', ee.String(yr));
//   })
// );
animation.animate(animated, {label: 'yearstring', maxFrames: 50, timeStep: 1500});


// Chart -------------------------------------------------------------------------
var ts = ui.Chart.image.seriesByRegion({
  imageCollection: drought,
  regions: ctef,
  reducer: ee.Reducer.mean(),
  band: 'CMI_gt_ante3_p10',
  scale: 1000,
  xProperty: 'year',
  seriesProperty: 'REG_ID'
});
// print(ts);

var ts = ui.Chart.image.seriesByRegion({
  imageCollection: drought,
  regions: ctef,
  reducer: ee.Reducer.mean(),
  band: 'CMI_gt_ante6_p10',
  scale: 1000,
  xProperty: 'year',
  seriesProperty: 'REG_ID'
});
// print(ts);


var ts = ui.Chart.image.seriesByRegion({
  imageCollection: drought,
  regions: ctef,
  reducer: ee.Reducer.mean(),
  band: 'CMI_gt_ante12_p10',
  scale: 1000,
  xProperty: 'year',
  seriesProperty: 'REG_ID'
});
// print(ts);


