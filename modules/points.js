/*
Build sampling collection
Alec L. Robitaille

*/


// Modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Export points as asset
var export_points_asset = function(n_pts, ecoregions, region_name) {
  var lc_mask = land_cover.get_lc_count_mask();
  
  var points = ecoregions.map(function(ft) {
    return stratified.stratified_sample(lc_mask, 'land_cover_count', 30, ft.geometry(), n_pts);
  }).flatten();
  
  var today = new Date().toJSON().slice(0, 10);
  var filename = today + '_' + region_name + '_sampling_points_n' + n_pts;
  Export.table.toAsset(points, filename, 'CFS/' + filename);
};
exports.export_points_asset = export_points_asset;