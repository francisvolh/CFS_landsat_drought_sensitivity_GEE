/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var bc = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
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
    west = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-141.4430528814123, 68.27919277463084],
          [-141.13300806589254, 64.04137893026935],
          [-139.73426050644431, 60.04815657459371],
          [-126.34684688322079, 49.10211106287488],
          [-108.90484061318891, 49.055202844054236],
          [-91.79138600476233, 48.67346079998252],
          [-95.41638550817073, 59.939877470328504],
          [-99.80739862269407, 62.42033801780019],
          [-108.28910573882132, 65.53581583394379],
          [-128.65907556424258, 68.27919277463084]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export tiles
Based on: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');


// Set variables
var ante_list = vars.ante_list;
var min_year =  vars.min_year;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;

var today = new Date().toJSON().slice(0, 10);
var asset_path = 'CFS/' + today;
var scale = 30;

var ecoregions = eco.non_arctic_ecoregions;



// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(ecoregions.geometry(), 6.3);



// loop regions
// asset_name = id
tiles = tiles.map(function(ft) {return ft.set('id', ft.get('system:index'))});
var tile_id_list = tiles.aggregate_array('id').distinct();
print(tile_id_list);

// some errors
tile_id_list = tile_id_list.slice(120, 130);

tile_id_list.evaluate(function(tile_ids) {
    tile_ids.forEach(function(tile_id) {
      var ft = tiles.filter(ee.Filter.eq('id', tile_id));
      export_img.export_img_asset_greenest('Abs_p15_p85' + '_' + tile_id, asset_path, scale, ft, min_year, max_year, min_mm_dd, max_mm_dd, ante_list);
    });
});