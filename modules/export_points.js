/*
Export points
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');
// var get_hydro = require('users/robitalec/CFS:modules/get_hydro.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var vegetation = require('users/robitalec/CFS:modules/vegetation.js');

// --- Sample -----------------------------------------------------------------
// var export_hydro = function(points, drive_name, drive_folder) {
//   var hydro = get_hydro.get_col();
// 	var sampled = hydro.reduceRegions(points, ee.Reducer.mean(), 30);
// 	var today = new Date().toJSON().slice(0, 10);
// 	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
// };
// exports.export_hydro = export_hydro;



var export_sensitivity_from_asset = function(points, drive_name, drive_folder) {
  // (thanks Noel https://gis.stackexchange.com/a/428747/27076)
  var asset_path = "users/robitalec/CFS/2022-07-28";
  print('asset path: ', asset_path);
  
  var assetList = ee.data.listAssets(asset_path)['assets']
                    .map(function(d) { return d.name });
  var drought_sens = ee.ImageCollection(assetList);

  drought_sens = drought_sens
    .mosaic()
    .addBands([ee.Image.pixelLonLat(), 
               eco.get_eco_bands()]);
  
	var sampled = drought_sens.reduceRegions(points, ee.Reducer.mean(), 30);
	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_sensitivity_from_asset = export_sensitivity_from_asset;



var export_vegetation = function(points, drive_name, drive_folder) {
  var veg = vegetation.get_canopy_height();
  // TODO: add forest carbon
  
	var sampled = veg.reduceRegions(points, ee.Reducer.mean(), 30);
	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_vegetation = export_vegetation;




// ARCHIVE ---------------------------------------------------------
var zzz_export_abs_sensitivity_cap = function(points, region, drive_name, drive_folder, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list) {

	var out = main.main_cap('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list);

  out = out.addBands([ee.Image.pixelLonLat()]);
  
	var sampled = points.map(function(ft) {
    return out.reduceRegion(ft, ee.Reducer.mean(), 30);
	}).flatten();

	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.zzz_export_abs_sensitivity_cap = zzz_export_abs_sensitivity_cap;


// Export task for each ecoregion
var zzz_export_by_ecoregion = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list, antecedent_list) {
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
exports.zzz_export_by_ecoregion = zzz_export_by_ecoregion;

// Export task for each ecoregion (cap)
var zzz_export_by_ecoregion_cap = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list) {
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
exports.zzz_export_by_ecoregion_cap = zzz_export_by_ecoregion_cap;

