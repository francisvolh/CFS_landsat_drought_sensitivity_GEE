/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-116.11289765759011, 65.82427374510517],
          [-141.0738351575901, 65.96784906972051],
          [-141.0298898450901, 60.28763396700523],
          [-123.31992890759011, 49.21598914801809],
          [-114.22324922009011, 49.07225327326708],
          [-112.15781953259011, 49.12979765473376],
          [-110.31211640759011, 49.043456059483354],
          [-110.09238984509011, 59.98127051095277],
          [-115.67344453259011, 59.9592781138163]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export tiles
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



var drive_folder = 'Exports';
var scale = 30;

// loop regions
// asset_name = id
tiles = tiles.map(function(ft) {return ft.set('id', ft.get('system:index'))});
var tile_id_list = tiles.aggregate_array('id').distinct();
print(tile_id_list);


tile_id_list.evaluate(function(tile_ids) {
    tile_ids.forEach(function(tile_id) {
      var ft = tiles.filter(ee.Filter.eq('id', tile_id));
      export_img.export_img_asset_cap('Abs_' + index + '_' + antecedent + '_p' + percentile_low + '_' + tile_id, drive_folder, scale, ft, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);
    });
});

Map.addLayer(tiles, null, 'tiles');