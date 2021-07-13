/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.MultiPoint(
        [[-137.79382204940853, 61.70640943974733],
         [-134.04433135464208, 61.362438237106865],
         [-138.07631377651708, 60.60037682923554],
         [-135.90102080776708, 60.356770556562736],
         [-137.90053252651708, 60.215185035664184],
         [-136.7081257649044, 61.762470780897694],
         [-139.2569538899044, 61.85070894149016],
         [-137.7628132649044, 62.185759364493904],
         [-140.2896687336544, 60.978172846788816],
         [-137.4002644367794, 61.25412379490356]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Compare raw indices


// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');

var modis = ee.ImageCollection("MODIS/006/MOD13Q1");

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
var indices = ['NDVI', 'EVI'];
// TODO: add NBR



// Modules ----------------------------------------------------------
// Load modules of functions

// Aggregate functions
var agg = require('users/robitalec/CFS:modules/aggregate.js');

// CMI functions
var cmiDaymet = require('users/robitalec/CFS:modules/cmi-daymet.js');

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');

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

// MODIS
modis = modis
  .filter(ee.Filter.calendarRange(minyear, maxyear, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));

// Landsat 5
l5 = l5
  .filterBounds(ctef)
  .filter(ee.Filter.calendarRange(minyearl5, maxyearl5, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));

// Landsat 7
l7 = l7
  .filterBounds(ctef)
  .filter(ee.Filter.calendarRange(minyearl7, maxyearl7, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));



// Compare ---------------------------------------------------------
// MODIS
// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
modis = modis
  // TODO: set year
  // TODO: calc indices
  // TODO: mask clouds
  .map(fire.maskFires)
  .map(lcmask.maskLc)
  .select(indices).map(function(img) {
    return img.multiply(0.0001)
              .float()
              .set('system:time_start', ee.Date.fromYMD(img.date().get('year'), 7, 10).millis())
})

// Landsat
// Merge L5 and L7
var landsat = l5.merge(l7);

// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
landsat = landsat
  .map(landsatprep.setYear)
  .map(landsatprep.calcIndices)
  .map(landsatprep.maskClouds)
  .map(fire.maskFires)
  .map(lcmask.maskLc)
  .map(function(img) {
    return img.set('system:time_start', ee.Date.fromYMD(img.date().get('year'), 7, 20).millis())
});

var m = modis.merge(landsat)
print(m)
var chart = ui.Chart.image.doySeriesByYear({
  imageCollection: landsat,
  bandName: 'EVI',
  region: ee.FeatureCollection(geometry),
  regionReducer: ee.Reducer.mean(),
  scale: 1e3,
  startDay: 100
})//.setChartType('ScatterChart');
print(chart)
// Map.addLayer(m.select('NDVI'))
