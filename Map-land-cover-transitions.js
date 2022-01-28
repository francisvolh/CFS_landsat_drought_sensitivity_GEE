// === Map land cover transitions ---------------------------------------------
// Alec L. Robitaille
// Palettes library: Gennadii Donchyts



// Function -------------------------------------------------------------------
// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');

// Land cover functions
var land_cover = require('users/robitalec/CFS:modules/land-cover.js');

// Palette
var palettes = require('users/gena/packages:palettes');



// Images ---------------------------------------------------------------------
// Hermosilla et al. 2022 land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");



// Processing -----------------------------------------------------------------
// TODO: mask fires

// Set years and mask classes
lc = lc.map(landsatprep.setYear)
       .map(maskClasses);

// Count unique classes (111122112233 = 3) 
var n_classes = lc.reduce(ee.Reducer.countDistinctNonNull());

// Count runs (111122112233 = 1 -> 2 -> 1 -> 2 -> 3 = 5) 
var n_runs = lc.reduce(ee.Reducer.countRuns());


// Map ------------------------------------------------------------------------
// Add a white background to hide the map, since some layers are masked
Map.addLayer(ee.Image.constant(1).mask());

// Palette
var pal = palettes.crameri.batlow[25];

// Land cover
Map.addLayer(lc, {palette: pal}, 'land cover', false);

// N classes (unique classes)
Map.addLayer(n_classes, null, 'n classes');

// N runs (unique runs of classes)
Map.addLayer(n_runs, null, 'n runs');