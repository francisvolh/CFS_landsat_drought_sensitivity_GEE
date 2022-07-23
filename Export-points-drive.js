/*
Export points drive
Based on: tests/test_export_points.js
Alec L. Robitaille
*/



// Modules --------------------------------------------------------------------
// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');


// Variables ------------------------------------------------------------------
var drive_folder = 'Exports';
var western_can = vars.western_can;


// Data -----------------------------------------------------------------------
// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');
ecoregions = ecoregions.filterBounds(western_can);

// Load points
var points = ee.FeatureCollection('users/robitalec/CFS/2022-05-25_sampling_points_n125');



// Sample ---------------------------------------------------------------------
// Sensitivity
export_points.export_sensitivity_from_asset(points, 'sample-sensitivity', drive_folder);

// Hydro
export_points.export_hydro(points, 'hydro', drive_folder);

// Climate


// Topo
