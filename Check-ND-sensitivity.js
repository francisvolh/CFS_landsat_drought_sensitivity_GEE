// Modules
var palettes = require('users/gena/packages:palettes');
var blend = require('users/jja/public:blend.js');




// Data
var col_nd = ee.ImageCollection('users/robitalec/CFS/2023-07-28/2023-07-28_image_col');
var col = ee.ImageCollection('users/robitalec/CFS/2023-02-21/2023-02-21_image_col');
var dem = ee.ImageCollection("projects/sat-io/open-datasets/FABDEM");

var dem_mosaic = dem
  .filterBounds(col_nd.geometry())
  .mosaic()
  .setDefaultProjection(dem.first().projection());

var hillshade = ee.Terrain.hillshade(dem_mosaic);
var hillshade_viz = hillshade.visualize({
    min:0,
    max:250,
    palette: ['#000000', '#ffffff'],
    forceRgbOutput:true
  });


// Palettes
var p = palettes.crameri.vik[10];

// Options
// print('Band names (Abs/rel)', col.first().bandNames());
// col = col.select('Abs_sens_NDVI_ante12mo_p15_p85');

// Options
// print('Band names (ND)', col_nd.first().bandNames());
// col_nd = col_nd.select('ND_sens_NDVI_ante12mo_p15_p85');


var col_mosaic = col
    .filterBounds(col_nd.geometry())
    .mosaic();
    

// Side by side maps
var Map_right = ui.Map();

// - Antecedent select
var ante = {
  '3 month': ['Abs_sens_NDVI_ante3mo_p15_p85', 'ND_sens_NDVI_ante3mo_p15_p85'],
  '12 month': ['Abs_sens_NDVI_ante12mo_p15_p85', 'ND_sens_NDVI_ante12mo_p15_p85'],
  '3 year': ['Abs_sens_NDVI_ante3yr_p15_p85', 'ND_sens_NDVI_ante3yr_p15_p85']
};

var select = ui.Select({
  items: Object.keys(ante),
  onChange: function(key) {
    Map.layers().reset();
    Map_right.layers().reset();
    
    // Left
    var sens_viz = col_mosaic.select(ante[key][0]).visualize({
      palette: p,
      min: -0.2,
      max: 0.2
    });
    var blend_col_hillshade = blend.multiply(sens_viz, hillshade_viz);
    var col_map = ui.Map.Layer(blend_col_hillshade, null, key);
    
    // Right
    var sens_viz_nd = col_nd.mosaic().select(ante[key][1]).visualize({
      palette: p,
      min: -0.2,
      max: 0.2
    });
    var blend_col_nd_hillshade = blend.multiply(sens_viz_nd, hillshade_viz);
    var col_nd_map = ui.Map.Layer(blend_col_nd_hillshade, null, key);
    Map.add(col_map);
    Map_right.add(col_nd_map);
  }
});
select.setValue('3 year');

// - Panel left
var panel_left = ui.Panel();
panel_left.style().set({
  width: '200px',
  position: 'top-left'
});


panel_left.add(ui.Label('Select antecedent period:'));
panel_left.add(select);

Map.add(panel_left);

// - Linker
var linker = ui.Map.Linker([ui.root.widgets().get(0), Map_right]);

var splitPanel = ui.SplitPanel({
  firstPanel: linker.get(0),
  secondPanel: linker.get(1),
  orientation: 'horizontal',
  wipe: false,
  style: {stretch: 'both'}
});

ui.root.widgets().reset([splitPanel]);




