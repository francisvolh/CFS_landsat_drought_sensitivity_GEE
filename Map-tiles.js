/*
Map tiles
Alec L. Robitaille

*/


// Modules
var blend = require('users/jja/public:blend.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var variables = require('users/robitalec/CFS:modules/variables.js');



// Data
var col = ee.ImageCollection('users/robitalec/CFS/2024-03-09/2024-03-09_image_col');
var lc = land_cover.land_cover();
var dem = ee.Image("MERIT/DEM/v1_0_3");



// Palettes
var lc_p = variables.lc_p;
var viz_sens = variables.nd_viz;



// Options
print('Band names', col.first().bandNames());
col = col.select('ND_sens_NDVI_ante12mo_p15_p85');



// Process
var lc_filter = lc.filter(ee.Filter.eq('year', 2010));
var hillshade = ee.Terrain.hillshade(dem);
var col_mosaic = col.mosaic();



// Visualize
var col_viz = col_mosaic.visualize(viz_sens);

var hillshade_viz = hillshade.visualize({
    min:0,
    max:250,
    palette: ['#000000', '#ffffff'],
    forceRgbOutput:true
  });


  
// Map
Map.addLayer(ee.Image.constant(1), {palette:'000', opacity:0.5}, 'constant');
Map.addLayer(lc_filter, {palette:lc_p}, 'lc', false);
Map.addLayer(col_mosaic, viz_sens, 'sensitivity', false);

// Blend
Map.addLayer(blend.multiply(col_viz, hillshade_viz), {min: 0.1, max: 0.75}, 'blend sensitivity and hillshade');
