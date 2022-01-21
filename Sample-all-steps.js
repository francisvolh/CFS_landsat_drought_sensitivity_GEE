/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var polygons = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-141.23205620026698, 60.41979920365629],
          [-132.53088432526698, 57.33302358860053],
          [-133.67346245026698, 52.75688444025042],
          [-124.18127495026698, 47.70308147300927],
          [-112.57971245026698, 48.98812225842628],
          [-116.00744682526698, 64.17335514796092],
          [-141.23205620026698, 65.2249422967821]]]),
    points = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.MultiPoint(
        [[-120.02437803208372, 56.52438100646832],
         [-116.94820615708372, 56.69970979965382],
         [-118.67246694131055, 56.154441684771434],
         [-136.91728237631563, 60.982984401796536],
         [-140.69657925131563, 62.12368198955072],
         [-140.76982845442157, 63.46615402037919],
         [-137.26518978254657, 63.15528203910088],
         [-137.78154720442157, 62.58922824931989],
         [-124.40657790241876, 48.68503849266654],
         [-124.62630446491876, 49.190201734866044],
         [-125.83480055866876, 49.37653263200246],
         [-126.16439040241876, 50.17115295052788],
         [-127.30696852741876, 50.24146818840383],
         [-127.87825758991876, 50.61938195875478]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Sample all steps ===
// Alec L. Robitaille

// var which_geo = 'points';
// print('Geometry set: ' + which_geo);


// Data -------------------------------------------------------------
// if (which_geo == 'points') {
//   var geo = points;
// } else if (which_geo == 'polygons') {
//   var geo = polygons;
// }


var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

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
// TODO: filter ecoregions
// ['CL09R05', 'CL09R07', 'CL13R02', 'CL13R03', 'CL13R04', 'CL13R05', 'CL12R07', 'CL12R08'];


// Landsat 5
l5 = l5
  .filterBounds(ecoregions)
  .filter(ee.Filter.calendarRange(minyearl5, maxyearl5, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));

// Landsat 7
l7 = l7
  .filterBounds(ecoregions)
  .filter(ee.Filter.calendarRange(minyearl7, maxyearl7, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));



// Daymet -----------------------------------------------------------
var drought = droughtModule.baselineCMI(percentiles);



// Landsat ----------------------------------------------------------
// Merge L5 and L7
var veg = l5.merge(l7)
.limit(2);
print(veg)

// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
veg = veg
  .map(landsatprep.maskL457sr)
  .map(landsatprep.setYear)
  .map(landsatprep.calcIndices)
  .map(water.maskWater)
  .map(fire.maskFires)
  .map(lcmask.maskClasses);

// Aggregate Landsat yearly, rename _mean bands
veg = landsatprep.aggregateY(veg).aside(print);
veg = veg.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);

// Split vegetation indices into drought/non-drought pixels
var splits = sensitivity.splitDrought(veg, drought, antes, percentiles, indices);

// Reduce yearly measures to means of all years
var means = splits.reduce(ee.Reducer.mean());



// Drought sensitivity -------------------------------------------
var droughtSens = sensitivity.droughtSensitivity(means, antes, percentiles, indices);


// Sample points -------------------------------------------------
var points = ecoregions.map(function(ft) {
  return ee.FeatureCollection.randomPoints(ft.geometry(), 500, 42)
              .map(function(f) {
                return f.set('ECOREGI', ft.get('ECOREGI'));
              });
}).flatten();

var means_names = means.bandNames()
                       .filter(ee.Filter.stringContains('item', 'p15'))
                       .filter(ee.Filter.or(
                                ee.Filter.stringContains('item', 'ante12mo'),
                                ee.Filter.stringContains('item', 'ante3mo'),
                                ee.Filter.stringContains('item', 'ante5yr')));
var drought_names = droughtSens.bandNames()
                       .filter(ee.Filter.stringContains('item', 'p15'))
                       .filter(ee.Filter.or(
                                ee.Filter.stringContains('item', 'ante12mo'),
                                ee.Filter.stringContains('item', 'ante3mo'),
                                ee.Filter.stringContains('item', 'ante5yr')));
var means_sel = means.select(means_names);
var drought_sel = droughtSens.select(drought_names);

var sampled = points.map(function(ft) {
  return ee.Image([means_sel, drought_sel])
    .sampleRegions(ft, null, 30);
}).flatten();


// Map -----------------------------------------------------------
Map.addLayer(ecoregions);



// Export --------------------------------------------------------
Export.table.toDrive({
  collection: sampled,
  description: 'sampled-intermediate-landsat-yt-ab-bc',
  folder: 'Drought-sensitivity-refugia'
});
