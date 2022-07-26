/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');
var palettes = require('users/gena/packages:palettes');

// Set variables
var min_year = 1985;
var max_year = 2021;
var min_mm_dd = '06-01';
var max_mm_dd = '09-30';
var percentile_low = 15;
var antecedent_list = ['3mo'];

var p = palettes.crameri.vik[10];
var ndvi_viz = {min:0.3, max:0.85};
var rel_viz = {min:-50, max:50, palette: p};
var abs_viz = {min:-0.5, max:0.5, palette: p};
var cmi_viz = {min:-15, max:15, palette: p};

var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);


// Test main - index + antecedent means
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_index_and_antecedent = main.main_greenest('vegetation index and antecedent means', geometry, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
print('veg index + antecedent means'); print(main_index_and_antecedent);
Map.setOptions('SATELLITE');
Map.addLayer(main_index_and_antecedent.select('CMI_ante3mo_mean').first(), cmi_viz, 'CMI 3 month antecedent mean', false);
Map.addLayer(main_index_and_antecedent.select('NDVI').first(), ndvi_viz, 'NDVI', false);

// Test main - relative
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_relative = main.main_greenest('relative sensitivity', geometry, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
print('relative sensitivity'); print(main_relative);
Map.addLayer(main_relative.select('Rel_sens_NDVI_ante3mo_p15_p85'), rel_viz, 'relative drought sensitivity NDVI p15-85 3 month antecedent', false);


// Test main - absolute
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_absolute = main.main_greenest('absolute sensitivity', geometry, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
print('absolute sensitivity'); print(main_absolute);
Map.addLayer(main_absolute.select('Abs_sens_NDVI_ante3mo_p15_p85'), abs_viz, 'absolute drought sensitivity NDVI p15-85  3 month antecedent');

Map.centerObject(geometry);