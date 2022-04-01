/*
Export img asset and drive
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Modal land cover
var lc_modal = land_cover.lc_and_fire.reduce(ee.Reducer.mode());
lc_modal = lc_modal.reproject(land_cover.lc_and_fire.first().projection());


// Export img
var export_img = function(region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
  return main.main('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
};

// Export img asset
// output either 'relative sensitivity' or 'absolute sensitivity'
var export_img_asset = function(asset_dir, asset_name, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
  var out = export_img(region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
  
  var today = new Date().toJSON().slice(0, 10);
  
  Export.image.toAsset(out, asset_dir + '/' + today + '_' + asset_name);

};
