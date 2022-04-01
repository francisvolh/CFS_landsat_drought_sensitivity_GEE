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
var export_img = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list) {
  var ecoreg_id_list = ecoregions
    .aggregate_array('ECOREGI')
    .distinct();

  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
      var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));
    
      var out = main.main(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
