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
print('Min year:', vars.min_year);
print('Max year:', vars.max_year);
print('Min month day:', vars.min_mm_dd);
print('Max month day:', vars.max_mm_dd);
print('Percentile low:', vars.percentile_low);
print('Percentile high:', vars.percentile_high);
print('Months:', vars.months);
print('Min drought nobs:', vars.min_drought_nobs);
print('Min baseline nobs:', vars.min_baseline_nobs);

// Assign
var index_list = vars.index_list;
var ante_list = vars.ante_list;
var min_year =  vars.min_year;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;
var percentile_low = vars.percentile_low;
var percentile_high = vars.percentile_high;
var months = vars.months;
var min_drought_nobs = vars.min_drought_nobs;
var min_baseline_nobs = vars.min_baseline_nobs;

// Map
Map.addLayer(vars.dawson, null, 'dawson');
Map.addLayer(vars.western_can, null, 'western_can');
Map.addLayer(vars.bc, null, 'bc');
Map.addLayer(vars.yukon, null, 'yukon');