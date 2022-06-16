/*
Export points
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');
var get_hydro = require('users/robitalec/CFS:modules/get_hydro.js');


// --- Sample -----------------------------------------------------------------
var export_hydro = function(points, drive_name, drive_folder) {
  var hydro = get_hydro.get_col();
	var sampled = hydro.reduceRegions(points, ee.Reducer.mean(), 30);
	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_hydro = export_hydro;



var export_abs_sensitivity_cap = function(points, region, drive_name, drive_folder, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list) {

	var out = main.main_cap('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent_list);

  out = out.addBands([ee.Image.pixelLonLat()]);
  
	var sampled = points.map(function(ft) {
    return out.reduceRegion(ft, ee.Reducer.mean(), 30);
	}).flatten();

	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_abs_sensitivity_cap = export_abs_sensitivity_cap;


var export_sensitivity_from_asset = function(points, drive_name, drive_folder) {

  var drought_sens = ee.ImageCollection([
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_0'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_1'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_2'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_3'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_4'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_5'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_11'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_12'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_13'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_14'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_15'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_16'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_17'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_22'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_23'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_24'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_25'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_26'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_27'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_28'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_30'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_33'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_34'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_35'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_36'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_37'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_38'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_39'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_40'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_41'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_42'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_43'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_44'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_45'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_46'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_47'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_48'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_49'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_50'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_51'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_52'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_53'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_54'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_55'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_56'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_57'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_58'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_59'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_60'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_61'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_62'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_63'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_64'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_65'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_67'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_68'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_69'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_70'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_71'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_72'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_73'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_74'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_75'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_76'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_78'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_79'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_80'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_81'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_82'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_83'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_84'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_85'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_86'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_87'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_90'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_91'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_92'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_93'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_94'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_95'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_96'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_97'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_98'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_101'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_102'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_103'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_104'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_105'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_106'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_107'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_108'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_109'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_112'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_113'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_114'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_115'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_116'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_117'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_118'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_119'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_120'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_125'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_126'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_127'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_128'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_129'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_130'),
    ee.Image('users/robitalec/CFS/2022-06-14/2022-06-14_Abs_NDVI_p15_85_131')]);

  drought_sens = drought_sens
    .mosaic()
    .addBands([ee.Image.pixelLonLat()]);
  
	var sampled = drought_sens.reduceRegions(points, ee.Reducer.mean(), 30);
	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_sensitivity_from_asset = export_sensitivity_from_asset;



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
