/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var alberta = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-121.33701085970853, 59.225203284768],
          [-121.33701085970853, 53.584414644169875],
          [-109.97714757845853, 53.584414644169875],
          [-109.97714757845853, 59.225203284768]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Calculate Drought Sensitivity ===
// --- MODIS ---
// Alec L. Robitaille

var region = 'Yukon';
print('Region set: ' + region);



// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');

var modis = ee.ImageCollection("MODIS/006/MOD09A1");



// Variables --------------------------------------------------------
// Set min max year for daymet
var minyear = 1980;
var maxyear = 2019;

// Set list of years and months
var months = ee.List.sequence(1, 12);
var years = ee.List.sequence(minyear, maxyear);

// Set percentiles to use
var percentiles = [1, 5, 10, 20];

// Set antecedent periods
var antes = [3, 6, 12];

// Set indices
var indices = ['NDVI', 'EVI', 'NBR'];



// Modules ----------------------------------------------------------
// Load modules of functions

// MODIS prep functions
var modisprep = require('users/robitalec/CFS:modules/modis-prep.js');

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Fire functions
var fire = require('users/robitalec/CFS:modules/fire.js');

// Water functions
var water = require('users/robitalec/CFS:modules/water.js');

// Sensitivity
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');

// Gena's palette functions
var palettes = require('users/gena/packages:palettes');

// Drought module
var droughtModule = require('users/robitalec/CFS:modules/drought.js');



// Filter -----------------------------------------------------------
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));

if (region == 'Yukon') {
  var geo = ctef;
} else if (region == 'Alberta') {
  var geo = alberta;
}

// MODIS
modis = modis
  .filter(ee.Filter.calendarRange(minyear, maxyear, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));

// Daymet -----------------------------------------------------------
var drought = droughtModule.baselineCMI();


// MODIS -----------------------------------------------------------
var veg = modis
  // *** CHECKING LANDSAT v MODIS ***
  .filter(ee.Filter.calendarRange(2000, 2012, 'year'))


// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices, rescale by 0.0001
veg = veg
  .map(modisprep.maskClouds)
  .map(modisprep.rescale)
  .map(modisprep.calcIndices)
  .map(fire.maskFires)
  .map(lcmask.maskLc)
  .map(water.maskWater)
  .select(indices);

// Split vegetation indices into drought/non-drought pixels
veg = modisprep.aggregateY(veg);
veg = veg.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);

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

Map.addLayer(droughtSens.select('Sens_NDVI_ante3mo_p10'), viz);
// Map.addLayer(droughtSensPrime.select('Sens_Prime_NBR_p20'));



// Export -------------------------------------------------------
var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-MOD09Q1-' + '2000_2012-' + region,
  folder: 'CFS-drought-sensitivity-MOD09Q1-' + '2000_2012-' + region,
  region: geo,
  scale: 250,
  maxPixels: 2e9
};
// Export.image.toDrive(exp);

var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-MOD09Q1-' + '2000_2012-' + region,
  assetId: 'CFS/drought-sensitivity-MOD09Q1-' + '2000_2012-' + region,
  region: geo,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toAsset(exp);
