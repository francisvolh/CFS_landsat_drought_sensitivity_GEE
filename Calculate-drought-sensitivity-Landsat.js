/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var alberta = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-119.93250204872565, 57.093629281447924],
          [-119.93250204872565, 54.00038691085837],
          [-113.60437704872565, 54.00038691085837],
          [-113.60437704872565, 57.093629281447924]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Calculate Drought Sensitivity ===
// --- Landsat ---
// Alec L. Robitaille





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
var percentiles = [5, 15];

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
var ctef_list = ['CL09R05', 'CL09R07', 
                 'CL13R02', 'CL13R03', 'CL13R04', 'CL13R05',
                 'CL12R07', 'CL12R08'];
                 
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ctef_list));



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
print(droughtSens)
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

// Map.addLayer(droughtSens.select('Sens_EVI_ante12mo_p10'), viz);
// Map.addLayer(droughtSensPrime.select('Sens_Prime_NBR_p20'));



// Export -------------------------------------------------------
var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-Landsat-yt_ab_bc',
  folder: 'Drought-sensitivity-refugia',
  region: geo,
  scale: 30,
  maxPixels: 1e9
};
Export.image.toDrive(exp);

var exp = {
  image: droughtSens,
  description: 'drought-sensitivity-Landsat-yt_ab_bc',
  assetId: 'CFS/drought-sensitivity-Landsat-yt_ab_bc',
  region: geo,
  scale: 30,
  maxPixels: 1e9
};
Export.image.toAsset(exp);
