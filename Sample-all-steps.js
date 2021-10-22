/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.MultiPoint(
        [[-120.01339170395872, 54.82097540279146],
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
// --- Landsat ---
// Alec L. Robitaille



// Data -------------------------------------------------------------
var geometry = /* color: #d63000 */ee.Geometry.MultiPoint(
        [[-120.01339170395872, 54.82097540279146],
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

// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions')
  .filterBounds(geometry)

var l5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR");
var l7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR");

var lc = ee.Image("ESA/GLOBCOVER_L4_200901_200912_V2_3").select('landcover');


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
var antes = [3, 12];

// Set indices
var indices = ['NDVI', 'NBR', 'EVI'];



// Modules ----------------------------------------------------------
// Load modules of functions

// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');

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
var geo = ctef

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

var modis = ee.ImageCollection("MODIS/006/MOD09A1");

// MODIS
modis = modis
  .filter(ee.Filter.calendarRange(minyear, maxyear, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'));



// Daymet -----------------------------------------------------------
var drought = droughtModule.baselineCMI(percentiles);



// Landsat ----------------------------------------------------------
// Merge L5 and L7
var veg = l5.merge(l7)
  // *** CHECKING LANDSAT v MODIS ***
  .filter(ee.Filter.calendarRange(2000, 2012, 'year'))

var veg_modis = modis
  // *** CHECKING LANDSAT v MODIS ***
  .filter(ee.Filter.calendarRange(2000, 2012, 'year'))

// Filter within min/max year and for July
// Mask clouds, fires, land cover and calculate indices
var veg_masked = veg
  .map(landsatprep.rescale)
  .map(landsatprep.setYear)
  .map(landsatprep.calcIndices)
  .map(landsatprep.maskClouds)
  .map(water.maskWater)
  .map(fire.maskFires)
  .map(lcmask.maskLc);

var veg_modis_masked = veg_modis
  .map(modisprep.maskClouds)
  .map(modisprep.rescale)
  .map(modisprep.calcIndices)
  .map(fire.maskFires)
  .map(lcmask.maskLc)
  .map(water.maskWater)
  .select(indices);

// Aggregate Landsat yearly, rename _mean bands
var veg_years = landsatprep.aggregateY(veg_masked);
veg_years = veg_years.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);

var veg_modis_years = modisprep.aggregateY(veg_modis_masked);
veg_modis_years = veg_modis_years.select(['NDVI_mean', 'EVI_mean', 'NBR_mean'], ['NDVI', 'EVI', 'NBR']);


// Split vegetation indices into drought/non-drought pixels
var splits = sensitivity.splitDrought(veg_years, drought, antes, percentiles, indices);

// Split vegetation indices into drought/non-drought pixels
var splits_modis = sensitivity.splitDrought(veg_modis_years, drought, antes, percentiles, indices);

// Reduce yearly measures to means of all years
var means = splits.reduce(ee.Reducer.mean());

// Reduce yearly measures to means of all years
var means_modis = splits_modis.reduce(ee.Reducer.mean());


// Drought sensitivity -------------------------------------------
// SP,T,L = [ (baseline EVIP – drought EVIP,T,L) / baseline EVIP ] x 100
var droughtSens = sensitivity.droughtSensitivity(means, antes, percentiles, indices);

// SP,T,L = [ (baseline EVIP – drought EVIP,T,L) / baseline EVIP ] x 100
var droughtSens_modis = sensitivity.droughtSensitivity(means_modis, antes, percentiles, indices);


// Sample points -------------------------------------------------
var points = ctef.map(function(ft) {
  return ee.FeatureCollection.randomPoints(ft.geometry(), 500, 42)
              .map(function(f) {
                return f.set('REG_ID', ft.get('REG_ID'));
              });
}).flatten();

var means_names = means.bandNames()
                       .filter(ee.Filter.stringContains('item', 'p15'))
                       .filter(ee.Filter.or(ee.Filter.stringContains('item', 'ante12mo'),
                                            ee.Filter.stringContains('item', 'ante3mo')));

var drought_names = droughtSens.bandNames()
                         .filter(ee.Filter.stringContains('item', 'p15'))
                         .filter(ee.Filter.or(ee.Filter.stringContains('item', 'ante12mo'),
                                              ee.Filter.stringContains('item', 'ante3mo')));

var means_sel = means.select(means_names);
var means_modis_sel = means_modis.select(means_names);
var drought_sel = droughtSens.select(drought_names);
var drought_modis_sel = droughtSens_modis.select(drought_names);

var sampled = points.map(function(ft) {
  return ee.Image([means_sel, drought_sel, means_modis_sel, drought_modis_sel, lc])
    .sampleRegions(ft, null, 30);
}).flatten();

Export.table.toDrive({
  collection: sampled,
  description: 'sampled-intermediate-landsat-and-modis-with-land-cover',
  folder: 'Drought-sensisitivity-refugia'
})
