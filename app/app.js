/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-142.55499390153335, 70.03530462152891],
          [-141.28886260033715, 59.73133485522378],
          [-132.97491577653335, 51.53555252654365],
          [-124.37867426910192, 48.11740729432402],
          [-109.40639935881254, 48.804462143547084],
          [-94.30304077653334, 49.12365840683438],
          [-82.70147827653334, 42.195333863545955],
          [-71.01202515153334, 45.11944811934683],
          [-66.96905640153334, 45.05739605590757],
          [-65.91436890153334, 43.16449754575042],
          [-52.203431401533344, 46.224859987659656],
          [-52.180299631222184, 49.641565048375476],
          [-57.209200883265744, 55.24608626628804],
          [-62.70636108903334, 59.220495521919005],
          [-78.92218140153334, 62.49163190377348],
          [-103.97100952653334, 67.692445654623],
          [-131.21710327653335, 69.08395110419174]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
App
Alec L. Robitaille

*/


// Modules
var blend = require('users/jja/public:blend.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var palettes = require('users/gena/packages:palettes');




// Data
var col = ee.ImageCollection('users/robitalec/CFS/2023-02-21/2023-02-21_image_col');

var lc = land_cover.land_cover();

var dem = ee.ImageCollection("projects/sat-io/open-datasets/FABDEM");


// Palettes
var p = palettes.crameri.vik[10];
var lc_p = palettes.crameri.bamako[25];


// Options
print('Band names', col.first().bandNames());
col = col.select('Abs_sens_NDVI_ante12mo_p15_p85');

// Process
var lc_filter = lc.filter(ee.Filter.eq('year', 2010));

var dem_mosaic = dem
  .filterBounds(geometry)
  .mosaic()
  .setDefaultProjection(dem.first().projection());

var hillshade = ee.Terrain.hillshade(dem_mosaic);

var col_mosaic = col
    //.filterBounds(geometry)
    .mosaic();

// Visualize
var col_viz = col_mosaic.visualize({
    palette:p,
    min: -0.2,
    max: 0.2
});

var hillshade_viz = hillshade.visualize({
    min:0,
    max:250,
    palette: ['#000000', '#ffffff'],
    forceRgbOutput:true
  });
  

// Map
Map.addLayer(ee.Image.constant(1), {palette:'000', opacity:0.5}, 'constant');

Map.addLayer(lc_filter, {palette:lc_p}, 'lc', false);


Map.addLayer(col_mosaic, {palette: p, min: -0.2, max: 0.2}, 'absolute sensitivity', false);


// Blend
Map.addLayer(blend.multiply(col_viz, hillshade_viz), {min: 0.1, max: 0.75}, 'blend sensitivity and hillshade');