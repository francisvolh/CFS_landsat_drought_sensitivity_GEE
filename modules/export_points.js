/*
Export points
Alec L. Robitaille
*/

// Modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var hydro = require('users/robitalec/CFS:modules/hydro.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var vegetation = require('users/robitalec/CFS:modules/vegetation.js');
var soil = require('users/robitalec/CFS:modules/soil.js');
var topo = require('users/robitalec/CFS:modules/topo.js');
var climate = require('users/robitalec/CFS:modules/climate.js');
var utils = require('users/robitalec/CFS:modules/utils.js');
var mask = require('users/robitalec/CFS:modules/mask.js');

 

// Wrapper export function
var export_to_drive = function(img, points, res, drive_name, drive_folder, type) {
  if (type == 'reduceRegions') {
    var sampled = img.reduceRegions(points, ee.Reducer.mean(), res);  
  } else if (type == 'sample') {
    var sampled = points.map(function(ft){return img.sample(ft.geometry(), res)}).flatten();
  } else if (type == 'getRegion') {
    var values = ee.ImageCollection(img).getRegion(points, res);
    var keys = values.get(0);
    var sampled = values.slice(1).map(function(o) {
      var properties = ee.Dictionary.fromLists(keys, o);
      return ee.Feature(null, properties);
    });
  } else {
    throw new Error("type not one of 'reduceRegions', 'getRegion', or 'sample'");
  }
	var today = new Date().toJSON().slice(0, 10);
	Export.table.toDrive(ee.FeatureCollection(sampled), today + '_' + drive_name, drive_folder);
};
exports.export_to_drive = export_to_drive;



// Get covariate bands
var ecoreg_bands = eco.eco_bands();
var lonlat = ee.Image.pixelLonLat();
var lc_mode = land_cover.mode_land_cover; // 30
var hydro_col = hydro.sampling_collection; // 30
var veg_col = vegetation.sampling_collection; // 30
var soil_col = soil.sampling_collection; // 250
var topo_col = topo.sampling_collection; // 90
var climate_col = climate.sampling_collection; // 1000, 11132

var covariates = ee.Image([
  lc_mode,
  ecoreg_bands,
  lonlat,
  hydro_col,
  veg_col,
  soil_col,
  topo_col,
  climate_col
]);
exports.covariates = covariates;



// Get band, resolution dictionary
var band_list = covariates.bandNames();

var res_list = [
  30, 30, 30, 30, 30, 30, 30, 30, 
  250, 
  30, 30, 
  90, 90, 90, 250, 
  90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 90, 
  1000, 1000, 1000, 1000, 1000,
  11132, 11132, 11132, 11132, 11132
];

var res_dict = ee.Dictionary.fromLists(band_list, res_list);
exports.res_dict = res_dict;


// Sample covariates
var sample_covariates = function(points, covariates, res_dict, drive_folder, type) {
  covariates.bandNames().evaluate(function(bands) {
      bands.forEach(function(band) {
        var res = res_dict.get(band);
        export_to_drive(covariates.select(band), points, res, 'sample-' + band, drive_folder, type);
      });
  });
};
exports.sample_covariates = sample_covariates;