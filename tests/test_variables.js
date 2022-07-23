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

// Assign
var index_list = vars.index_list;
var ante_list = vars.ante_list;
var min_year =  vars.min_year;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;

// Map
Map.addLayer(vars.dawson, null, 'dawson');
Map.addLayer(vars.western, null, 'western');