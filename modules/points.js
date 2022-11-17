/*
Build sampling collection
Alec L. Robitaille

*/


// Modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var utils = require('users/robitalec/CFS:modules/utils.js');

// Export points as asset
var export_points_asset = function(n_pts, ecoregions, region_name) {
  var lc = land_cover.hermosilla_1984_2019
    .map(utils.set_year);

  lc = mask.apply_mask(lc)
    .mode()
    .rename('land_cover');

  var points = ecoregions.map(function(ft) {
    return stratified.stratified_sample(lc, 'land_cover', 30, ft.geometry(), n_pts);
  }).flatten();

  var today = new Date().toJSON().slice(0, 10);
  var filename = today + '_' + region_name + '_sampling_points_n' + n_pts;
  Export.table.toAsset(points, filename, 'CFS/' + filename);
};
exports.export_points_asset = export_points_asset;


// Export points by tile as asset
var export_points_by_tile_asset = function(tiles, factor) {
  var points = tiles.map(function(tile) {
    return tile.sample({
      scale: 30,
      factor: factor,
      geometries: true
    }); 
  }).flatten();

  var today = new Date().toJSON().slice(0, 10);
  var filename = today + '_sampling_points_tiles_' + factor * 100 + 'percent';
  Export.table.toAsset(points, filename, 'CFS/' + filename);
};
exports.export_points_by_tile_asset = export_points_by_tile_asset;

