/*
Export points drive
Based on: tests/test_export_points.js
Alec L. Robitaille
*/



// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');
var assets = require('users/robitalec/CFS:modules/assets.js');
var points = require('users/robitalec/CFS:modules/points.js');



// Variables ------------------------------------------------------------------
var drive_folder = 'Exports';

// Load ecoregions
var non_arctic_ecoregions = eco.non_arctic_ecoregions;


// Data -----------------------------------------------------------------------
// Generate points
var factor = 0.005;
var factor_char = '0pt5percent';
var col = ee.ImageCollection('users/robitalec/CFS/2023-02-21/2023-02-21_image_col');

// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(0, 20)), factor, factor_char + '_seven1');
// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(20, 40)), factor, factor_char + '_seven2');
// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(40, 60)), factor, factor_char + '_seven3');
// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(60, 80)), factor, factor_char + '_seven4');
// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(80, 100)), factor, factor_char + '_seven5');
// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(100, 120)), factor, factor_char + '_seven6');
// points.export_points_by_img_col_asset(ee.ImageCollection(col.toList(150).slice(120, 140)), factor, factor_char + '_seven7');

// Asset
var points_1 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven7');
var points_1_name = 'tiles_0pt5percent_seven1';
var points_2 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven2');
var points_2_name = 'tiles_0pt5percent_seven2';
var points_3 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven3');
var points_3_name = 'tiles_0pt5percent_seven3';
var points_4 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven4');
var points_4_name = 'tiles_0pt5percent_seven4';
var points_5 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven5');
var points_5_name = 'tiles_0pt5percent_seven5';
var points_6 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven6');
var points_6_name = 'tiles_0pt5percent_seven6';
var points_7 = ee.FeatureCollection('users/robitalec/CFS/2023-04-24_sampling_points_tiles_0pt5percent_seven7');
var points_7_name = 'tiles_0pt5percent_seven7';


// Sample ---------------------------------------------------------------------
// Soil
// export_points.export_soil(points_1, 'sample-soil-' + points_1_name, drive_folder);
// export_points.export_soil(points_2, 'sample-soil-' + points_2_name, drive_folder);
// export_points.export_soil(points_3, 'sample-soil-' + points_3_name, drive_folder);
// export_points.export_soil(points_4, 'sample-soil-' + points_4_name, drive_folder);
// export_points.export_soil(points_5, 'sample-soil-' + points_5_name, drive_folder);
// export_points.export_soil(points_6, 'sample-soil-' + points_6_name, drive_folder);
// export_points.export_soil(points_7, 'sample-soil-' + points_7_name, drive_folder);

// Vegetation
export_points.export_vegetation(points_1, 'sample-vegetation-' + points_1_name, drive_folder);
export_points.export_vegetation(points_2, 'sample-vegetation-' + points_2_name, drive_folder);
export_points.export_vegetation(points_3, 'sample-vegetation-' + points_3_name, drive_folder);
export_points.export_vegetation(points_4, 'sample-vegetation-' + points_4_name, drive_folder);
export_points.export_vegetation(points_5, 'sample-vegetation-' + points_5_name, drive_folder);
export_points.export_vegetation(points_6, 'sample-vegetation-' + points_6_name, drive_folder);
export_points.export_vegetation(points_7, 'sample-vegetation-' + points_7_name, drive_folder);

// Hydro
// export_points.export_hydro(points_1, 'sample-hydro-' + points_1_name, drive_folder);
// export_points.export_hydro(points_2, 'sample-hydro-' + points_2_name, drive_folder);
// export_points.export_hydro(points_3, 'sample-hydro-' + points_3_name, drive_folder);
// export_points.export_hydro(points_4, 'sample-hydro-' + points_4_name, drive_folder);
// export_points.export_hydro(points_5, 'sample-hydro-' + points_5_name, drive_folder);
// export_points.export_hydro(points_6, 'sample-hydro-' + points_6_name, drive_folder);
// export_points.export_hydro(points_7, 'sample-hydro-' + points_7_name, drive_folder);

// Topo
// export_points.export_topo(points_1, 'sample-topo-' + points_1_name, drive_folder);
// export_points.export_topo(points_2, 'sample-topo-' + points_2_name, drive_folder);
// export_points.export_topo(points_3, 'sample-topo-' + points_3_name, drive_folder);
// export_points.export_topo(points_4, 'sample-topo-' + points_4_name, drive_folder);
// export_points.export_topo(points_5, 'sample-topo-' + points_5_name, drive_folder);
// export_points.export_topo(points_6, 'sample-topo-' + points_6_name, drive_folder);
// export_points.export_topo(points_7, 'sample-topo-' + points_7_name, drive_folder);

// Climate
// export_points.export_climate(points_1, 'sample-climate-' + points_1_name, drive_folder);
// export_points.export_climate(points_2, 'sample-climate-' + points_2_name, drive_folder);
// export_points.export_climate(points_3, 'sample-climate-' + points_3_name, drive_folder);
// export_points.export_climate(points_4, 'sample-climate-' + points_4_name, drive_folder);
// export_points.export_climate(points_5, 'sample-climate-' + points_5_name, drive_folder);
// export_points.export_climate(points_6, 'sample-climate-' + points_6_name, drive_folder);
// export_points.export_climate(points_7, 'sample-climate-' + points_7_name, drive_folder);

// Lc, ecoreg, lon lat
// export_points.export_lc_and_ecoreg(points_1, 'sample-lc-ecoreg-' + points_1_name, drive_folder);
// export_points.export_lc_and_ecoreg(points_2, 'sample-lc-ecoreg-' + points_2_name, drive_folder);
// export_points.export_lc_and_ecoreg(points_3, 'sample-lc-ecoreg-' + points_3_name, drive_folder);
// export_points.export_lc_and_ecoreg(points_4, 'sample-lc-ecoreg-' + points_4_name, drive_folder);
// export_points.export_lc_and_ecoreg(points_5, 'sample-lc-ecoreg-' + points_5_name, drive_folder);
// export_points.export_lc_and_ecoreg(points_6, 'sample-lc-ecoreg-' + points_6_name, drive_folder);
// export_points.export_lc_and_ecoreg(points_7, 'sample-lc-ecoreg-' + points_7_name, drive_folder);

// Sensitivity
// export_points.export_sensitivity_from_asset(points, 'sample-sensitivity-' + points_name, drive_folder);
