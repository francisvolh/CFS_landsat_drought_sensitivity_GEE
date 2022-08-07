/*
Export img asset and drive
Alec L. Robitaille
*/


// Modules
var main = require('users/robitalec/CFS:modules/main.js');
var hydro = require('users/robitalec/CFS:modules/hydro.js');



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
var export_img_drive_from_asset = function(asset_folder, bounds, drive_folder, scale) {
  // (thanks Noel https://gis.stackexchange.com/a/428747/27076)
  var asset_list = ee.data.listAssets(asset_folder)['assets']
    .map(function(asset) {
      return ee.Image(asset.name).set({'asset-name': asset.name});
  });
  
  var filter_asset = ee.ImageCollection(asset_list)
    .filterBounds(bounds)
    .aggregate_array('asset-name')
    .getInfo();
    
  
  var tiles = filter_asset.map(function(asset) {
    var out = ee.Image(asset);
  
    Export.image.toDrive({
      image: out,
      description: asset.split('/').reverse()[0],
      folder: drive_folder,
      scale: scale,
      maxPixels: 200000000
    });
    return out;
  });
};
exports.export_img_drive_from_asset = export_img_drive_from_asset;



// Export hydro sampling collection
var export_hydro_sampling_collection = function(region, region_name, scale) {
  var col = hydro.sampling_collection();

  var today = new Date().toJSON().slice(0, 10);

  var asset_name = today + '_' + region_name + '_hydro_sampling_collection';
  Export.image.toAsset({
    image: col,
    description: asset_name,
    assetId: 'CFS/' + asset_name,
    region: region,
    scale: scale,
    maxPixels: 2100000000
  });
};
exports.export_hydro_sampling_collection = export_hydro_sampling_collection;



// Export climate sampling collection
var export_climate_sampling_collection = function(region, region_name, scale) {
  var col = climate.sampling_collection();

  var today = new Date().toJSON().slice(0, 10);

  var asset_name = today + '_' + region_name + '_climate_sampling_collection';
  Export.image.toAsset({
    image: col,
    description: asset_name,
    assetId: 'CFS/' + asset_name,
    region: region,
    scale: scale,
    maxPixels: 2100000000
  });
};
exports.export_climate_sampling_collection = export_climate_sampling_collection;




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

