/*
Export img asset and drive
Alec L. Robitaille
*/



var main = require('users/robitalec/CFS:modules/main.js');


// Export img asset greenest
var export_img_asset_greenest = function(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list) {
  var out = main.main_greenest('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);

  var today = new Date().toJSON().slice(0, 10);

  asset_name = today + '_' + asset_name;
  Export.image.toAsset({
    image: out,
    description: asset_name,
    assetId: asset_path + '/' + asset_name,
    region: region,
    scale: scale,
    maxPixels: 2.5e8
  });
};
exports.export_img_asset_greenest = export_img_asset_greenest;



// Export img drive greenest
var export_img_drive_greenest = function(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list) {
  var out = main.main_greenest('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);

  var today = new Date().toJSON().slice(0, 10);

  Export.image.toDrive({
    image: out,
    description: today + '_' + drive_name,
    folder: drive_folder,
    region: region,
    scale: scale,
    maxPixels: 200000000
  });
};
exports.export_img_drive_greenest = export_img_drive_greenest;



// Export img drive from asset
var export_img_drive_from_asset = function(asset_folder, drive_folder) {
  // (thanks Noel https://gis.stackexchange.com/a/428747/27076)
  var asset_list = ee.data.listAssets(asset_folder)['assets']
                    .map(function(d) { return d });
  
  var tiles = asset_list.slice(0, 2).map(function(asset) {
    var out = ee.Image(asset.name);
    
    Export.image.toDrive({
      image: out,
      description: asset.id.split('/').reverse()[0],
      folder: drive_folder,
      scale: scale,
      maxPixels: 200000000
    });
  });
};
exports.export_img_drive_from_asset = export_img_drive_from_asset;




// ARCHIVE --------------------------------------------------------------------
// Export img asset cap
var zzz_export_img_asset_cap = function(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent) {
  var out = main.main_cap('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);

  var today = new Date().toJSON().slice(0, 10);

  asset_name = today + '_' + asset_name;
  Export.image.toAsset({
    image: out,
    description: asset_name,
    assetId: asset_path + '/' + asset_name,
    region: region,
    scale: scale,
    maxPixels: 2.5e8
  });
};
exports.zzz_export_img_asset_cap = zzz_export_img_asset_cap;



// Export img drive cap
var zzz_export_img_drive_cap = function(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent) {
  var out = main.main_cap('absolute sensitivity', region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile_low, percentile_high, antecedent);

  var today = new Date().toJSON().slice(0, 10);

  Export.image.toDrive({
    image: out,
    description: today + '_' + drive_name,
    folder: drive_folder,
    region: region,
    scale: scale
  });
};
exports.zzz_export_img_drive_cap = zzz_export_img_drive_cap;

// Export img asset
var zzz_export_img_asset = function(asset_name, asset_path, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
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
exports.zzz_export_img_asset = zzz_export_img_asset;



// Export img drive
var zzz_export_img_drive = function(drive_name, drive_folder, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
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
exports.zzz_export_img_drive = zzz_export_img_drive;



// Export img cloud
var zzz_export_img_cloud = function(cloud_name, cloud_bucket, scale, region, min_year, max_year, min_mm_dd, max_mm_dd, index, percentile, antecedent) {
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
exports.zzz_export_img_cloud = zzz_export_img_cloud;

