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
var index = ['NDVI', 'NBR'];
var antecedent = ['3mo', '12mo'];

var region = geometry_yt;

// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(region, 7);


// var today = new Date().toJSON().slice(0, 10);
// var drive_folder = today;
var scale = 30;


var asset_folder = 'users/robitalec/CFS/2022-07-10';
var drive_folder = '2022-07-10'
export_img.export_img_drive_from_asset(asset_folder, geometry_yt, drive_folder, scale);


// // loop regions
// // asset_name = id
// tiles = tiles.map(function(ft) {return ft.set('id', ft.get('system:index'))});
// var tile_id_list = tiles.aggregate_array('id').distinct();
// // print(tile_id_list);

// tile_id_list.evaluate(function(tile_ids) {
//     tile_ids.forEach(function(tile_id) {
//       var ft = tiles.filter(ee.Filter.eq('id', tile_id));
//       export_img.export_img_drive_greenest('Abs_p15_p85' + '_' + tile_id, drive_folder, scale, ft, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
//     });
// });
