/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-169.947757868042, 74.19688274436743],
          [-169.947757868042, 24.716404693071457],
          [-49.71338286804201, 24.716404693071457],
          [-49.71338286804201, 74.19688274436743]]], null, false),
    geometry2 = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-147.8210336191388, 70.07926665876009],
          [-147.8210336191388, 47.928518609971924],
          [-93.5925179941388, 47.928518609971924],
          [-93.5925179941388, 70.07926665876009]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Modules ----------------------------------------------------------
// Load modules of functions

// Aggregate functions
var agg = require('users/robitalec/CFS:modules/aggregate.js');

// CMI functions
var cmiDaymet = require('users/robitalec/CFS:modules/cmi-daymet.js');

// Baseline functions
var baseline = require('users/robitalec/CFS:modules/baseline.js');

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Fire functions
var fire = require('users/robitalec/CFS:modules/fire.js');

// Sensitivity
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');

// Gena's palette functions
var palettes = require('users/gena/packages:palettes');


// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));

// Aggregate --------------------------------------------------------
// Set min max year for daymet
var minyear = 1980;
var maxyear = 2019;

var aggDaymet = cmiDaymet.prepDaymet(minyear, maxyear);


// Calculate CMI ----------------------------------------------------
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


// Calculate baseline -----------------------------------------------
// Set percentiles to use. Javascript list.
var percentiles = [1, 5, 10, 20];

// Calculate antecedent means across years. Eg. mean CMI for antecedent 3 period across years
var means = baseline.antecedentMeans(aggDaymet, 'CMI', years);

// Compare antecedent means to percentiles. Eg. mean CMI for ante 3 year 2011 vs full period 10%
var drought = baseline.gtPercentile(means, percentiles);

// Drop 1980 since there's no complete antecedent 12 period
drought = drought.filter(ee.Filter.neq('year', 1980));

// Fire -------------------------------------------------------------
// Load NFDB fire polygons
var firepol = ee.FeatureCollection("users/robitalec/CFS/NFDB_poly");

// Generate fire masks. Each year has a mask which represents fires in the last year
var firemask = fire.fireMasks(firepol, years);


// Land Cover ------------------------------------------------------
// Load GlobCover and mask
var lc = lcmask.lcMask();


// EVI/NDVI ---------------------------------------------------------
// Load MODIS EVI/NDVI
// Filter within min/max year and for July
var veg = ee.ImageCollection("MODIS/006/MOD13Q1")
  .filter(ee.Filter.calendarRange(minyear, maxyear, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));

// Mask fire and land cover, return baseline and drought percentiles EVI/NDVI across years
var maskveg = sensitivity.maskVeg(veg, drought, firemask, lc, percentiles);

// Reduce yearly measures to means of all years
var means = maskveg.reduce(ee.Reducer.mean());

// Drought sensitivity -------------------------------------------
// SP,T,L = [ (baseline EVIP – drought EVIP,T,L) / baseline EVIP ] x 100
var droughtSens = sensitivity.droughtSensitivity(means, percentiles);

// Drought sensitivity prime (S’) = max across three antecedent periods
var droughtSensPrime = sensitivity.droughtSensivitityPrime(droughtSens, percentiles);


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


// Map.addLayer(droughtSens.select('Sensitivity_NDVI_ante3_p5'), viz);
// Map.addLayer(droughtSens.select('Sensitivity_NDVI_ante6_p5'));
// Map.addLayer(droughtSens.select('Sensitivity_NDVI_ante12_p5'));
// Map.addLayer(droughtSensPrime.select('Sens_Prime_NDVI_p5'));

// Export -------------------------------------------------------
var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-' + minyear + '-' + maxyear,
  folder: 'CFS-drought-sensitivity',
  region: geometry,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toDrive(exp);

var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-' + minyear + '-' + maxyear,
  assetId: 'CFS/drought-sensitivity-' + minyear + '-' + maxyear,
  region: geometry,
  scale: 250,
  maxPixels: 2e9
};
// Export.image.toAsset(exp);
