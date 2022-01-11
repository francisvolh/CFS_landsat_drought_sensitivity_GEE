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
        [[[-119.93250204872565, 57.093629281447924],
          [-119.93250204872565, 54.00038691085837],
          [-113.60437704872565, 54.00038691085837],
          [-113.60437704872565, 57.093629281447924]]], null, false),
    west = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-141.43046875000002, 61.75390836272355],
          [-140.31151452966327, 60.40992197889474],
          [-136.42070312500002, 60.26326999182864],
          [-131.05937500000002, 55.95106562006025],
          [-126.225390625, 49.24129644870385],
          [-114.2283203125, 49.398843742620556],
          [-115.32673718969228, 52.99516979937244],
          [-114.94155782936775, 54.929168350786135],
          [-110.14140625, 54.62490733037994],
          [-110.229296875, 60.84653394179026],
          [-110.14140625, 66.67170637803635],
          [-125.9116190088051, 67.25718358813353],
          [-136.50859375000002, 67.49302695510208],
          [-140.99101562500002, 67.45935893840027]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Calculate Drought Sensitivity ===
// --- Landsat ---
// Alec L. Robitaille


var region = 'West';
print('Region set: ' + region);



// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');


var l5 = ee.ImageCollection('LANDSAT/LT05/C02/T1_L2');
var l7 = ee.ImageCollection('LANDSAT/LE07/C02/T1_L2');


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
var percentiles = [15];

// Set antecedent periods
var antes = ['3mo', '12mo', '5yr'];

// Set indices
var indices = ['NDVI', 'NBR', 'EVI'];



// Modules ----------------------------------------------------------
// Load modules of functions

// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');

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
} else if (region == 'West') {
  var geo = west;
}

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
var drought = droughtModule.baselineCMI(percentiles);



// Landsat ----------------------------------------------------------
// Merge L5 and L7
var veg = l5.merge(l7);


// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
veg = veg
  .map(landsatprep.maskL457sr)
  .map(landsatprep.setYear)
  .map(landsatprep.calcIndices)
  .map(water.maskWater)
  .map(fire.maskFires)
  .map(lcmask.maskLandCover);

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
print(droughtSens)
// Drought sensitivity prime (S’) = max across three antecedent periods
// var droughtSensPrime = sensitivity.droughtSensivitityPrime(droughtSens, percentiles);



// Map ------------------------------------------------------------
var pal = palettes.colorbrewer.RdBu[9];
var min = -50; var max = 50;
var viz = {min: min, max: max, palette: pal};

Map.addLayer(geo)
// function showPalette(name, palette) {
//   var image = ee.Image.pixelLonLat().select(0)
//     .clip(ee.Geometry.Rectangle({ coords: [[0, 0], [100, 10]], geodesic: false }))
//     .visualize({ min: 0, max: 100, palette: palette });

//   print(name);
//   print(ui.Thumbnail(image));
// }
// showPalette(min + '           0           ' + max, palettes.colorbrewer.RdBu[5]);

// Map.addLayer(droughtSens.select('Sens_EVI_ante12mo_p10'), viz);
// Map.addLayer(droughtSensPrime.select('Sens_Prime_NBR_p20'));



// Export -------------------------------------------------------
var exp = {
  image: droughtSens.select('Sens_NDVI_ante12mo_p15'),
  description: 'drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-' + region,
  folder: 'Drought-sensitivity-refugia',
  region: geo,
  scale: 1000,
  maxPixels: 1e9
};
Export.image.toDrive(exp);

var exp = {
  image: droughtSens.select('Sens_NDVI_ante12mo_p15'),
  description: 'drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-' + region,
  assetId: 'CFS/drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-' + region,
  region: geo,
  scale: 30,
  maxPixels: 1e9
};
// Export.image.toAsset(exp);
