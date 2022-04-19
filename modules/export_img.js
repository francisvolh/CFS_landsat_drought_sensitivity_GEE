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



// Export img asset
var export_img_asset = function(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
  var out = main.main('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
  
  var today = new Date().toJSON().slice(0, 10);
  
  asset_name = today + '_' + asset_name;
  Export.image.toAsset({
    image: out, 
    description: asset_name, 
    assetId: asset_path + '/' + asset_name, 
    region: region, 
    scale: scale
  });
};
exports.export_img_asset = export_img_asset;



// Export img drive
var export_img_drive = function(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
  var out = main.main('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
  
  var today = new Date().toJSON().slice(0, 10);
  
  Export.image.toDrive({
    image: out, 
    description: today + '_' + drive_name, 
    folder: drive_folder, 
    region: region,
    scale: scale
  });
};
exports.export_img_drive = export_img_drive;



// Export img cloud
var export_img_cloud = function(cloud_name, cloud_bucket, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
  var out = main.main('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent);
  
  var today = new Date().toJSON().slice(0, 10);
  
  cloud_name = today + '_' + cloud_name;
  Export.image.toCloudStorage({
    image: out, 
    description: cloud_name, 
    bucket: cloud_bucket, 
    region: region, 
    scale: scale
  });
};
exports.export_img_cloud = export_img_cloud;



// ----------------- CAP --------------------------
// Export img asset
var export_img_asset_cap = function(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent) {
  var out = main.main_cap('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);
  
  var today = new Date().toJSON().slice(0, 10);
  
  asset_name = today + '_' + asset_name;
  Export.image.toAsset({
    image: out, 
    description: asset_name, 
    assetId: asset_path + '/' + asset_name, 
    region: region, 
    scale: scale
  });
};
exports.export_img_asset_cap = export_img_asset_cap;

