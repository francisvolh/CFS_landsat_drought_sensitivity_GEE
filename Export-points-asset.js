/*
Export points asset
Based on: tests/test_export_points.js
Alec L. Robitaille
*/



// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var eco = require('users/robitalec/CFS:modules/ecoregions.js');



// Variables ------------------------------------------------------------------
var asset_folder = '2022-11-29';



// Data -----------------------------------------------------------------------
// Load ecoregions
var non_arctic_ecoregions = eco.non_arctic_ecoregions;

// Load points
var points = ee.FeatureCollection('users/robitalec/CFS/2022-07-29_Yukon_sampling_points_n250');



// Sample ---------------------------------------------------------------------
// Sensitivity
export_points.export_sensitivity_from_asset(points, 'sample-sensitivity-' + region_name, drive_folder);

// Soil
export_points.export_soil(points, 'sample-soil-' + region_name, 'Exports');

// Vegetation
export_points.export_vegetation(points, 'sample-vegetation-' + region_name, 'Exports');

// Hydro
export_points.export_hydro(points, 'sample-hydro-' + region_name, drive_folder);

// Topo
export_points.export_topo(points, 'sample-topo-' + region_name, 'Exports');

// Climate
export_points.export_climate(points, 'sample-climate-' + region_name, 'Exports');



