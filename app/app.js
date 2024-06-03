/*

App
Alec L. Robitaille

*/

// Modules
var variables = require('users/robitalec/CFS:modules/variables.js');
var blend = require('users/jja/public:blend.js');
var palettes = require('users/gena/packages:palettes');



// Data
var col = ee.ImageCollection('users/robitalec/CFS/2024-03-09/2024-03-09_image_col');
var dem = ee.Image("MERIT/DEM/v1_0_3");



// Palettes
var p = palettes.crameri.vik[10];
var p_not_grey = palettes.crameri.imola[25];
var viz_sens = variables.nd_viz;



// Process
var hillshade = ee.Terrain.hillshade(dem);

var col_mosaic = col.mosaic();



// Visualize
var hillshade_viz = hillshade.visualize({
    min:0,
    max:250,
    palette: ['#000000', '#ffffff'],
    forceRgbOutput:true
  });



// UI
Map.setCenter(-100, 62, 4);
Map.setOptions('SATELLITE');



// - Antecedent select
var ante = {
  '3 month': ['ND_sens_NDVI_ante3mo_p15_p85'],
  '12 month': ['ND_sens_NDVI_ante12mo_p15_p85'],
  '3 year': ['ND_sens_NDVI_ante3yr_p15_p85']
};

var select = ui.Select({
  items: Object.keys(ante),
  onChange: function(key) {
    Map.layers().reset();
    var sens_viz = col_mosaic.select(ante[key][0]).visualize(viz_sens);
    var blend_col_hillshade = blend.multiply(sens_viz, hillshade_viz);
    var col_map = ui.Map.Layer(blend_col_hillshade, null, key);
    Map.add(col_map);
  }
});
select.setValue('12 month');



// - Panels
var panel_bottom_right = ui.Panel();
panel_bottom_right.style().set({
  width: '300px',
  position: 'bottom-right'
});

var panel_bottom_left = ui.Panel();
panel_bottom_left.style().set({
  width: '300px',
  position: 'bottom-left'
});

// Add
panel_bottom_right.add(ui.Label('Antecedent period:'));
panel_bottom_right.add(select);
// Adapted from palettes.showPalette to fit into panel
var img_thumb = ui.Thumbnail(ee.Image.pixelLonLat().select(0)
  .clip(ee.Geometry.Rectangle({ coords: [[0, 0], [100, 7]], geodesic: false }))
  .visualize({min: 0, max: 100, palette: p}));
panel_bottom_right.add(ui.Label(''));
panel_bottom_right.add(ui.Label('Drought sensitivity ='));
panel_bottom_right.add(ui.Label('(baseline - drought) / (baseline - drought)'));
panel_bottom_right.add(img_thumb);
panel_bottom_right.add(ui.Label('-0.2 _______________ 0 _______________ 0.2'));


panel_bottom_left.add(ui.Label('Drought sensitivity refugia'));
panel_bottom_left.add(ui.Label('Diana Stralberg, Alec L. Robitaille, Zihaohan Sang, Guillermo Castilla, Jennifer Cartwright, Mike Michaelian, and Ted Hogg'));
panel_bottom_left.add(ui.Label('Canadian Forest Service / Natural Resources Canada / Government of Canada'));

Map.add(panel_bottom_left);
Map.add(panel_bottom_right);
