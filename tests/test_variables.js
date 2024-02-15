/*
Testing: modules/variables.js
Alec L. Robitaille
*/

// Load modules
var vars = require('users/robitalec/CFS:modules/variables.js');



// Testing
print('---- Variables -------------------------- ');
print('Index list:', vars.index_list);
print('Antecedent list:', vars.ante_list);
print('Min year daymet:', vars.min_year_climate);
print('Min year landsat:', vars.min_year_landsat);
print('Max year:', vars.max_year);
print('Min month day:', vars.min_mm_dd);
print('Max month day:', vars.max_mm_dd);
print('Percentile low:', vars.percentile_low);
print('Percentile high:', vars.percentile_high);
print('Months:', vars.months);
print('Weeks:', vars.weeks);
print('Min drought nobs:', vars.min_drought_nobs);
print('Min baseline nobs:', vars.min_baseline_nobs);
print('CMI viz:', vars.cmi_viz);
print('Relative viz:', vars.rel_viz);
print('Absolute viz:', vars.abs_viz);



// Assign
var index_list = vars.index_list;
var ante_list = vars.ante_list;
var min_year_climate =  vars.min_year_climate;
var min_year_landsat =  vars.min_year_landsat;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;
var percentile_low = vars.percentile_low;
var percentile_high = vars.percentile_high;
var months = vars.months;
var weeks = vars.weeks;
var min_drought_nobs = vars.min_drought_nobs;
var min_baseline_nobs = vars.min_baseline_nobs;
var cmi_viz = vars.cmi_viz;
var rel_viz = vars.rel_viz;
var abs_viz = vars.abs_viz;



// Map
Map.addLayer(vars.dawson, null, 'dawson');
Map.addLayer(vars.western_can, null, 'western_can');
Map.addLayer(vars.bc, null, 'bc');
Map.addLayer(vars.yukon, null, 'yukon');
