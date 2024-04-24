/*
Export single image to drive
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Set variables
var region = vars.canada;
var output = 'normalized difference sensitivity';
var scale = 1000;


// File name
var export_name = 'ND_sens_p15_85';

// Export image to drive
export_img.export_img_drive_from_asset(output, export_name, 'Exports', scale, region);

// Map region
Map.addLayer(region);
