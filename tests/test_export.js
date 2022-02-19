/*
Testing: modules/exports.js
Alec L. Robitaille
*/

// Load modules
var export_by = require('users/robitalec/CFS:modules/export.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile_list = [10, 20];
var index_list = ['NDVI', 'NBR'];
var drive_folder = 'Batch-ecoregion-export';
var n_pts = 10;

// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');
// ecoregions = ecoregions.filterBounds(geometry).limit(3);



// Test export_by_ecoregion - veg index and ante means
// Usage: export_by_ecoregion(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
// export_by.export_by_ecoregion('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
// Map.addLayer(ecoregions)

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

var lc_2002 = land_cover.lc_and_fire.filter(ee.Filter.eq('year', 2002)).first();
print(lc_2002)

var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', 136));

var out = main.main(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var lc_2002 = land_cover.lc_and_fire.filter(ee.Filter.eq('year', 2002)).first();
var points = stratified.stratified_sample(lc_2002, 'land_cover', ft.geometry(), n_pts);
print(out)
// if (output == 'relative sensitivity' | output == 'absolute sensitivity') {
//   var sampled = output.reduceRegions(points, ee.Reducer.mean(), 30);
// } else if (output == 'vegetation index and antecedent means') {
var sampled = ee.ImageCollection(out).map(function(img) {
  return img.reduceRegions(points, ee.Reducer.mean(), 30);
}).flatten();
print(sampled)