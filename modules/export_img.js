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
  
  Export.image.toDrive(out, today + '_' + drive_name, drive_folder, scale);
};
exports.export_img_drive = export_img_drive;




var exp = {
  image: droughtSens.select('Sens_NDVI_ante12mo_p15'),
  description: today + '_drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-' + region,
  assetId: 'CFS/' + today + '_drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-' + region,
  region: albertasubsample,
  scale: 30,
  maxPixels: 1e9
};
Export.image.toAsset(exp);

