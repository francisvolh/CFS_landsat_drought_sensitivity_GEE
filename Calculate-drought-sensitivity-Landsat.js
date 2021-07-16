/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var alberta = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-121.99793173622565, 57.83806575741446],
          [-121.99793173622565, 53.909883123620126],
          [-109.93494345497565, 53.909883123620126],
          [-109.93494345497565, 57.83806575741446]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Calculate Drought Sensitivity ===
// --- Landsat ---
// Alec L. Robitaille


var region = 'Alberta'; 



// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');


var l5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR");
var l7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR");


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

// Min/max years Landsat 7
var minyearl7 = 1999;
var maxyearl7 = 2003;
var yearsl7 = ee.List.sequence(minyearl7, maxyearl7);

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
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');

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

if (region == 'Yukon') {
  var geo = ctef;
} else if (region == 'Alberta') {
  var geo = alberta;
}
print('Region set: ' + region);

// Landsat 5
l5 = l5
  .filterBounds(geo)
  .filter(ee.Filter.calendarRange(minyearl5, maxyearl5, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));

// Landsat 7
l7 = l7
  .filterBounds(geo)
  .filter(ee.Filter.calendarRange(minyearl7, maxyearl7, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));



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
// Merge L5 and L7
var veg = l5.merge(l7);

// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
veg = veg
  .map(landsatprep.rescale)
  .map(landsatprep.setYear)
  .map(landsatprep.calcIndices)
  .map(landsatprep.maskClouds)
  .map(landsatprep.maskWater)
  .map(fire.maskFires)
  .map(lcmask.maskLc);

// Aggregate Landsat yearly, rename _mean bands
veg = landsatprep.aggregateY(veg);
veg = veg.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);

// Split vegetation indices into drought/non-drought pixels
var splits = sensitivity.splitDrought(veg, drought, antes, percentiles, indices);

// Reduce yearly measures to means of all years
var means = splits.reduce(ee.Reducer.mean());



// Drought sensitivity -------------------------------------------
// SP,T,L = [ (baseline EVIP – drought EVIP,T,L) / baseline EVIP ] x 100
var droughtSens = sensitivity.droughtSensitivity(means, antes, percentiles, indices);

// Drought sensitivity prime (S’) = max across three antecedent periods
// var droughtSensPrime = sensitivity.droughtSensivitityPrime(droughtSens, percentiles);



// Map ------------------------------------------------------------
var pal = palettes.colorbrewer.RdBu[9];
var min = -50; var max = 50;
var viz = {min: min, max: max, palette: pal};

// function showPalette(name, palette) {
//   var image = ee.Image.pixelLonLat().select(0)
//     .clip(ee.Geometry.Rectangle({ coords: [[0, 0], [100, 10]], geodesic: false }))
//     .visualize({ min: 0, max: 100, palette: palette });

//   print(name);
//   print(ui.Thumbnail(image));
// }
// showPalette(min + '           0           ' + max, palettes.colorbrewer.RdBu[5]);

Map.addLayer(droughtSens.select('Sens_EVI_ante12mo_p10'), viz);
// Map.addLayer(droughtSensPrime.select('Sens_Prime_NBR_p20'));



// Export -------------------------------------------------------
var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-Landsat-' + region,
  folder: 'CFS-drought-sensitivity-Landsat-' + region,
  region: geo,
  scale: 250,
  maxPixels: 1e9
};
// Export.image.toDrive(exp);

var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-Landsat-' + region,
  assetId: 'CFS/drought-sensitivity-Landsat-' + region,
  region: geo,
  scale: 30,
  maxPixels: 1e9
};
Export.image.toAsset(exp);
