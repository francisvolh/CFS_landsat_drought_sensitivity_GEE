/*
Export points
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');


// --- Sample -----------------------------------------------------------------
var export_abs_sensitivity_cap = function(points, region, drive_name, drive_folder, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list) {

	var out = main.main_cap('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list);

  out = out.addBands([ee.Image.pixelLonLat()]);
  
	var sampled = points.map(function(ft) {
    return out.reduceRegion(ft, ee.Reducer.mean(), 30)//.copyProperties(ft);
	}).flatten();

	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_abs_sensitivity_cap = export_abs_sensitivity_cap;



// --- Export by --------------------------------------------------------------
// Export task for each ecoregion
var export_by_ecoregion = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list, antecedent_list) {
  var ecoreg_id_list = ecoregions
    .aggregate_array('ECOREGI')
    .distinct();

  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
      var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));

      var out = main.main(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list, antecedent_list);
      var lc_modal = land_cover.lc_and_fire.reduce(ee.Reducer.mode());
      lc_modal = lc_modal.changeProj(lc_modal.projection(), land_cover.lc_and_fire.first().projection());
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



// Export task for each ecoregion (cap)
var export_by_ecoregion_cap = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list) {
  var ecoreg_id_list = ecoregions
    .aggregate_array('ECOREGI')
    .distinct();

  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
      var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));

      var out = main.main_cap(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list);
      var lc_modal = land_cover.lc_and_fire.reduce(ee.Reducer.mode());
      lc_modal = lc_modal.changeProj(lc_modal.projection(), land_cover.lc_and_fire.first().projection());
      var points = stratified.stratified_sample(lc_modal, 'land_cover_mode', 30, ft.geometry(), n_pts);

      var sampled = ee.ImageCollection(out).map(function(img) {
        return img.reduceRegions(points, ee.Reducer.mean(), 30);
      }).flatten();

      var today = new Date().toJSON().slice(0, 10);
      Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + ecoreg_id, folder);
    });
  });
};
exports.export_by_ecoregion_cap = export_by_ecoregion_cap;



// TODO: export_sensitivity_by_ecoregion
// TODO: export_hydro
// TODO: export_climate
// TODO: export_topo
