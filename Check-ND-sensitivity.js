// Modules
var palettes = require('users/gena/packages:palettes');




// Data
var col_nd = ee.ImageCollection('users/robitalec/CFS/2023-07-28/2023-07-28_image_col');
var col = ee.ImageCollection('users/robitalec/CFS/2023-02-21/2023-02-21_image_col');


// Palettes
var p = palettes.crameri.vik[10];

// Options
print('Band names (Abs/rel)', col.first().bandNames());
col = col.select('Abs_sens_NDVI_ante12mo_p15_p85');

// Options
print('Band names (ND)', col_nd.first().bandNames());
col_nd = col_nd.select('ND_sens_NDVI_ante12mo_p15_p85');


var col_mosaic = col
    .filterBounds(col_nd.geometry())
    .mosaic();
    

// Side by side maps
var Map_right = ui.Map();

// - Antecedent select
var ante = {
  '3 month': ['Abs_sens_NDVI_ante3mo_p15_p85'],
  '12 month': ['Abs_sens_NDVI_ante12mo_p15_p85'],
  '3 year': ['Abs_sens_NDVI_ante3yr_p15_p85']
};

var select = ui.Select({
  items: Object.keys(ante),
  onChange: function(key) {
    Map.layers().reset();
    var sens_viz = col_mosaic.select(ante[key][0]).visualize({
      palette: p,
      min: -0.2,
      max: 0.2
    });
    var blend_col_hillshade = blend.multiply(sens_viz, hillshade_viz);
    var col_map = ui.Map.Layer(blend_col_hillshade, null, key);
    Map.add(col_map);
  }
});
select.setValue('3 year');

panel_left.add(ui.Label('1. Antecedent period:'));
panel_left.add(select);


Map.addLayer(col_mosaic, {palette: p, min: -0.2, max: 0.2}, 'absolute 12mo', false);
Map.addLayer(col_nd, {palette: p, min: -0.2, max: 0.2}, 'norm diff 12mo');




