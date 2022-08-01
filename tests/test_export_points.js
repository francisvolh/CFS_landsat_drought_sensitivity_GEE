/*
Testing: modules/exports_points.js
Alec L. Robitaille
*/

// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');
var vars = require('users/robitalec/CFS:modules/variables.js');

// Set variables
var drive_folder = 'Exports';
var n_pts = 10;



// Test export_hydro
// Usage: export_hydro(points, drive_name, drive_folder)
// export_points.export_hydro(points, 'test-export-hydro', 'Exports');



// Test export_vegetation
// Usage: export_vegetation(points, drive_name, drive_folder)
export_points.export_vegetation(points, 'test-export-vegetation', 'Exports');
