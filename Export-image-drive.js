/*
Export single image to drive
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Set variables
var region = vars.dawson;
var ante_list = vars.ante_list;
var min_year =  vars.min_year;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;



// File name
var export_name = 'sens_p15_p85';

// Export image to drive
export_img.export_img_drive_greenest(export_name, 'Exports', 30, region, min_year, max_year, min_mm_dd, max_mm_dd, ante_list);
