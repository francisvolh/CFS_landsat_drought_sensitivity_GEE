/*
Export tiles: BC
Based on: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var min_year = 1985;
var max_year = 2020;
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_low = 15;
var percentile_high = 85;
var index = ['NDVI'];
var antecedent = ['12mo'];

// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(geometry, 7);



var asset_path = 'CFS';
var scale = 30;

// loop regions
// asset_name = id
tiles = tiles.map(function(ft) {return ft.set('id', ft.get('system:index'))});
var tile_id_list = tiles.aggregate_array('id').distinct();
print(tile_id_list);

tile_id_list = tile_id_list.slice(80, 110);

tile_id_list.evaluate(function(tile_ids) {
    tile_ids.forEach(function(tile_id) {
      var ft = tiles.filter(ee.Filter.eq('id', tile_id));
      export_img.export_img_asset_cap('Abs_' + index + '_' + antecedent + '_p' + percentile_low + '_' + tile_id, asset_path, scale, ft, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);
    });
});

Map.addLayer(tiles, null, 'tiles');