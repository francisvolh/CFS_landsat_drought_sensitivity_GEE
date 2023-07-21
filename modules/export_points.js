/*
Export points
Alec L. Robitaille
*/



var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');
var hydro = require('users/robitalec/CFS:modules/hydro.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var vegetation = require('users/robitalec/CFS:modules/vegetation.js');
var soil = require('users/robitalec/CFS:modules/soil.js');
var topo = require('users/robitalec/CFS:modules/topo.js');
var climate = require('users/robitalec/CFS:modules/climate.js');
var utils = require('users/robitalec/CFS:modules/utils.js');
var mask = require('users/robitalec/CFS:modules/mask.js');



// Wrapper export function
var export_to_drive = function(col, points, res, drive_name, drive_folder, type) {
  if (type == 'reduceRegions') {
    var sampled = col.reduceRegions(points, ee.Reducer.mean(), res);  
  } else if (type == 'sample') {
    var sampled = points.map(function(ft){return col.sample(ft.geometry(), res)}).flatten();
  } else {
    throw new Error("type not one of 'reduceRegions', or 'sample'");
  }
	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};


// Sample
// Land cover and ecoregion
var export_lc_and_ecoreg = function(points, drive_name, drive_folder, type) {
  var lc = land_cover.hermosilla_1984_2019
    .map(utils.set_year);

  lc = mask.apply_masks(lc)
    .mode()
    .rename('land_cover');

  var ecoreg_bands = eco.eco_bands();

  var col = ecoreg_bands.addBands([lc, ee.Image.pixelLonLat()]);
  
  export_to_drive(col, points, 30, drive_name, drive_folder, type);
};
exports.export_lc_and_ecoreg = export_lc_and_ecoreg;



// Hydro
var export_hydro = function(points, drive_name, drive_folder, type) {
  var col = hydro.sampling_collection();
  export_to_drive(col, points, 30, drive_name, drive_folder, type);
};
exports.export_hydro = export_hydro;



// Vegetation
var export_vegetation = function(points, drive_name, drive_folder, type) {
  var col = vegetation.sampling_collection();
  export_to_drive(col, points, 30, drive_name, drive_folder, type);
};
exports.export_vegetation = export_vegetation;



var export_soil = function(points, drive_name, drive_folder) {
  var col = soil.sampling_collection();
  export_to_drive(col, points, 30, drive_name, drive_folder);
};
exports.export_soil = export_soil;



var export_topo = function(points, drive_name, drive_folder, type) {
  var col = topo.sampling_collection();
  export_to_drive(col, points, 30, drive_name, drive_folder, type);
};
exports.export_topo = export_topo;



var export_climate = function(points, drive_name, drive_folder, type) {
  var col = climate.sampling_collection();
  export_to_drive(col, points, 30, drive_name, drive_folder, type);
};
exports.export_climate = export_climate;