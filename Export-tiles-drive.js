/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry_bc = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-139.0898192325786, 59.84160650588499],
          [-137.3979247013286, 58.844554732801065],
          [-135.4423582950786, 59.55335579276839],
          [-132.04814453125002, 56.65906345951007],
          [-130.13652343750002, 55.988978735208754],
          [-130.61992187500002, 54.7656482896553],
          [-132.81718750000002, 54.44749301746334],
          [-134.04765625000002, 53.881482994863525],
          [-130.13652343750002, 51.05845159151662],
          [-125.10478515625, 48.505467360817676],
          [-123.91826171875, 48.28662749247955],
          [-123.12724609375, 48.30124610625738],
          [-123.21513671875, 49.012436323310986],
          [-114.00859375, 48.99802247751824],
          [-114.448046875, 49.96867592964471],
          [-115.56865234375, 51.05845159151662],
          [-119.96318359375, 53.64769740403339],
          [-120.073046875, 55.56884052787107],
          [-120.1609375, 59.99057921359762],
          [-121.127734375, 59.946592182407706],
          [-128.68632812500002, 59.99057921359762],
          [-134.57500000000002, 59.99057921359762],
          [-138.92558593750002, 59.99057921359762]]]),
    geometry_yt = /* color: #82d682 */ee.Geometry.Polygon(
        [[[-141.03564838179497, 65.29837358256377],
          [-141.14551166304497, 61.117076110171034],
          [-139.10205463179497, 59.9938683577217],
          [-137.38818744429497, 59.93888090358338],
          [-129.74170306929497, 59.98287816850865],
          [-123.80908588179496, 59.905844598822966],
          [-124.02881244429496, 60.09261594397401],
          [-124.57812885054496, 60.90409694970527],
          [-126.62158588179496, 60.8185046463646],
          [-127.93994525679496, 61.737084421224544],
          [-129.80762103804497, 63.17949034543585],
          [-132.32551751640625, 64.93059438270835],
          [-133.95149407890625, 66.9967609655182],
          [-136.19270501640625, 67.04822570308592],
          [-136.45637689140625, 68.43763003906189],
          [-141.02668939140625, 68.44570385411821]]]);
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
var index = ['NDVI', 'NBR'];
var antecedent = ['3mo', '12mo'];

var region = geometry_yt;

// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(region, 7);


var today = new Date().toJSON().slice(0, 10);
var drive_folder = today;
var scale = 30;


var asset_folder = 'users/robitalec/CFS/2022-07-10';
export_img.export_img_drive_from_asset(asset_folder, bounds, drive_folder, scale);


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
