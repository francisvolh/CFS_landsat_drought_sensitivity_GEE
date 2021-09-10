/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-140.9594647158567, 64.06256790235535],
          [-140.9594647158567, 61.98024284713474],
          [-136.0815350283567, 61.98024284713474],
          [-136.0815350283567, 64.06256790235535]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Sample indices before calculation ===
// --- Landsat ---
// Alec L. Robitaille


var region = 'Yukon';
print('Region set: ' + region);


var geometry = 
    ee.Geometry.Polygon(
        [[[-140.9594647158567, 64.06256790235535],
          [-140.9594647158567, 61.98024284713474],
          [-136.0815350283567, 61.98024284713474],
          [-136.0815350283567, 64.06256790235535]]], null, false);
          

// Data -------------------------------------------------------------
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
var percentiles = [10];

// Set antecedent periods
var antes = [3, 6, 12];

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
var geo = geometry;

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
var drought = droughtModule.baselineCMI();



// Landsat ----------------------------------------------------------
// Merge L5 and L7
var veg = l5.merge(l7)
  // *** CHECKING LANDSAT v MODIS ***
  .filter(ee.Filter.calendarRange(2000, 2012, 'year'))


// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
veg = veg
  .map(landsatprep.rescale)
  .map(landsatprep.setYear)
  .map(landsatprep.calcIndices)
  .map(landsatprep.maskClouds)
  .map(water.maskWater)
  .map(fire.maskFires)
  .map(lcmask.maskLc);

// Aggregate Landsat yearly, rename _mean bands
veg = landsatprep.aggregateY(veg);
veg = veg.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);

// Split vegetation indices into drought/non-drought pixels
var splits = sensitivity.splitDrought(veg, drought, antes, percentiles, indices);

var exp = {
  image: splits,
  description: 'sample-indices-pre-calc-Landsat' + region,
  assetId: 'sample-indices-pre-calc-Landsat' + region,
  region: geo,
  scale: 30,
  maxPixels: 1e9
};
Export.image.toAsset(exp);
