/*
Export img asset and drive
Alec L. Robitaille
*/



// Modules
var main = require('users/robitalec/CFS:modules/main.js');
var hydro = require('users/robitalec/CFS:modules/hydro.js');



// Export img asset greenest
var export_img_asset_greenest = function(output, asset_name, asset_path, scale, region) {
  var out = main.main_greenest(output, region);

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
var export_img_drive_greenest = function(output, drive_name, drive_folder, scale, region) {
  var out = main.main_greenest(output, region);

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