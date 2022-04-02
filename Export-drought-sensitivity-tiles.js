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
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile = [15];
var index = ['NDVI'];
var antecedent = ['12mo'];



var drive_folder = 'Batch-ecoregion-export';


// Test export_img
// Usage: export_by_ecoregion(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
export_by.export_by_ecoregion('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
// Map.addLayer(ecoregions)
/*
Testing: modules/export_img.js
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile = [15];
var index = ['NDVI'];
var 


var drive_folder = 'Batch-ecoregion-export';


// Test export_img
// Usage: export_by_ecoregion(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
export_by.export_by_ecoregion('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
// Map.addLayer(ecoregions)


var tiler = require('users/gena/packages:tiler')




var tiles = tiler.getTilesForGeometry(geometry, 6)
 
var export_by_ecoregion = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list) {
  var ecoreg_id_list = ecoregions
    .aggregate_array('ECOREGI')
    .distinct();

  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
      var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));
    
      var out = main.main(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);

      var points = stratified.stratified_sample(lc_modal, 'land_cover_mode', 30, ft.geometry(), n_pts);
      
      var sampled = ee.ImageCollection(out).map(function(img) {
        return img.reduceRegions(points, ee.Reducer.mean(), 30);
      }).flatten();
    
      var today = new Date().toJSON().slice(0, 10);
      Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + ecoreg_id, folder);
    });
  });
};
exports.export_by_ecoregion = export_by_ecoregion;







Map.addLayer(tiles, null, 'tiles')