/*
Export img
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Modal land cover
var lc_modal = land_cover.lc_and_fire.reduce(ee.Reducer.mode());
lc_modal = lc_modal.reproject(land_cover.lc_and_fire.first().projection());

// Export img
// output either 'relative sensitivity' or 'absolute sensitivity'
var export_img = function(output, folder, n_pts, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
  var out = main.main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);

}
