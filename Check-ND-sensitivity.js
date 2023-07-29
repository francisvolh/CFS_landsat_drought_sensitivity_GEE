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
    
    
Map.addLayer(col_mosaic, {palette: p, min: -0.2, max: 0.2}, 'absolute 12mo', false);
Map.addLayer(col_nd, {palette: p, min: -0.2, max: 0.2}, 'norm diff 12mo');
