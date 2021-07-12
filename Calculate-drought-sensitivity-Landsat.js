// === Calculate Drought Sensitivity ===
// --- Landsat ---
// Alec L. Robitaille


// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');


var l5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR");



// Variables --------------------------------------------------------
// Set min max year for daymet
var minyear = 1980;
var maxyear = 2019;

// Set list of years and months
var months = ee.List.sequence(1, 12);
var years = ee.List.sequence(minyear, maxyear);


// Min/max years Landsat 5
var minyearl5 = 1985;
var maxyearl5 = 2012;
var yearsl5 = ee.List.sequence(minyearl5, maxyearl5);

// Set percentiles to use
var percentiles = [1, 5, 10, 20];

// Set antecedent periods
var antes = [3, 6, 12];

// Set indices
var indices = ['NDVI', 'NBR', 'EVI'];


// Modules ----------------------------------------------------------
// Load modules of functions

// Aggregate functions
var agg = require('users/robitalec/CFS:modules/aggregate.js');

// CMI functions
var cmiDaymet = require('users/robitalec/CFS:modules/cmi-daymet.js');

// Landsat prep functions
var l5prep = require('users/robitalec/CFS:modules/l5-prep.js');
var l7prep = require('users/robitalec/CFS:modules/l5-prep.js');

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Baseline functions
var baseline = require('users/robitalec/CFS:modules/baseline.js');

// Fire functions
var fire = require('users/robitalec/CFS:modules/fire.js');

// Sensitivity
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');

// Gena's palette functions
var palettes = require('users/gena/packages:palettes');



// Filter -----------------------------------------------------------
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));


// Landsat 5
// TODO: filter Landsat 5
  // .filterBounds(ctef)
  // .filter(ee.Filter.calendarRange(minyearl5, maxyearl5, 'year'))
  // .filter(ee.Filter.calendarRange(7, 7, 'month'))

// Landsat 7
// TODO: filter Landsat 7
  // .filterBounds(ctef)
  // .filter(ee.Filter.calendarRange(minyearl5, maxyearl5, 'year'))
  // .filter(ee.Filter.calendarRange(7, 7, 'month'))



// Daymet -----------------------------------------------------------
// Aggregate
var aggDaymet = cmiDaymet.prepDaymet(minyear, maxyear);

// Calculate CMI (and ETMAX, ETMIN, ETDEW, VPD, TAVG 5, 15, KTRF and PET)
aggDaymet = aggDaymet
  .map(cmiDaymet.calcETMAX)
  .map(cmiDaymet.calcETMIN)
  .map(cmiDaymet.calcETDEW)
  .map(cmiDaymet.calcVPD)
  .map(cmiDaymet.calcTAVG515)
  .map(cmiDaymet.calcKTRF)
  .map(cmiDaymet.calcPET)
  .map(cmiDaymet.calcCMI);

// Calculate baseline
// Calculate antecedent means across years. Eg. mean CMI for antecedent 3 period across years
var means = baseline.antecedentMeans(aggDaymet, 'CMI', years);

// Compare antecedent means to percentiles. Eg. mean CMI for ante 3 year 2011 vs full period 10%
var drought = baseline.ltPercentile(means, percentiles);

// Drop before 1985 since there's no complete antecedent 12 period (1980) or 5 yr (1980-1985)
drought = drought.filter(ee.Filter.gt('year', 1980));



// Landsat ----------------------------------------------------------
// TODO: var veg = Merge L5 L7


// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
veg = veg

  .map(l5prep.setYear)
  .map(l5prep.cloudMaskL5)
  .map(l5prep.calcIndices)
  .map(fire.maskFires)
  .map(lcmask.maskLc);

// Aggregate Landsat yearly, rename _mean bands
veg = l5prep.aggregateY(veg);
veg = veg.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);

// Drop years in drought that aren't in veg
drought = drought.filter(ee.Filter.inList('year', veg.aggregate_array('year').distinct()));

// Split vegetation indices into drought/non-drought pixels
var splits = sensitivity.splitDrought(veg, drought, antes, percentiles, indices);

// Reduce yearly measures to means of all years
var means = veg.reduce(ee.Reducer.mean());



// Drought sensitivity -------------------------------------------
// SP,T,L = [ (baseline EVIP – drought EVIP,T,L) / baseline EVIP ] x 100
var droughtSens = sensitivity.droughtSensitivity(means, antes, percentiles, indices);

// Drought sensitivity prime (S’) = max across three antecedent periods
// var droughtSensPrime = sensitivity.droughtSensivitityPrime(droughtSens, percentiles);



// Map ------------------------------------------------------------
var pal = palettes.colorbrewer.RdBu[9];
var min = -20; var max = 20;
var viz = {min: min, max: max, palette: pal};

// function showPalette(name, palette) {
//   var image = ee.Image.pixelLonLat().select(0)
//     .clip(ee.Geometry.Rectangle({ coords: [[0, 0], [100, 10]], geodesic: false }))
//     .visualize({ min: 0, max: 100, palette: palette });

//   print(name);
//   print(ui.Thumbnail(image));
// }
// showPalette(min + '           0           ' + max, palettes.colorbrewer.RdBu[5]);

// Map.addLayer(droughtSens.select('Sensitivity_NBR_ante12_p5'), viz);
// Map.addLayer(droughtSensPrime.select('Sens_Prime_NBR_p20'));



// Export -------------------------------------------------------
var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-Landsat-' + minyear + '-' + maxyear,
  folder: 'CFS-drought-sensitivity-Landsat-',
  region: ctef,
  scale: 250,
  maxPixels: 1e9
};
// Export.image.toDrive(exp);

var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-Landsat-' + minyear + '-' + maxyear,
  assetId: 'CFS/drought-sensitivity-Landsat-' + minyear + '-' + maxyear,
  region: ctef,
  scale: 30,
  maxPixels: 1e9
};
Export.image.toAsset(exp);
