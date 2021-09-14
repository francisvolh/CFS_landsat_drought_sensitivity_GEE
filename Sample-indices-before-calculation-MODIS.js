// === Sample indices before calculation ===
// --- MODIS ---
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
// CTEF regions
var modis = ee.ImageCollection("MODIS/006/MOD09A1");



// Variables --------------------------------------------------------
// Set min max year for daymet
var minyear = 1980;
var maxyear = 2019;

// Set list of years and months
var months = ee.List.sequence(1, 12);
var years = ee.List.sequence(minyear, maxyear);

// Set percentiles to use
var percentiles = [10];

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
var geo = geometry;

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

var yr = 2003;
var exp = {
  image: means,
  description: 'sample-indices-means-MODIS-' + region,
  assetId: 'sample-indices-means-MODIS-' +  region,
  region: geo,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toAsset(exp);
