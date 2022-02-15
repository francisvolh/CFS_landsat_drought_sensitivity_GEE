/*
Testing: modules/sensitivity.js
Alec L. Robitaille
*/

// Load modules
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');
var split_drought = require('users/robitalec/CFS:modules/split_drought.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Set variables
var min_year = 2010; var max_year = 2015;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var percentile_list = [5, 10];
var index_list = ['NDVI', 'EVI'];
var antecedent_list = ['3mo', '12mo', '5yr'];
var rel_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};
var abs_viz = {min:-400, max:400, palette: palettes.colorbrewer.RdBu[5]};
var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Processing
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);
var indices_col = get_landsat.get_indices(min_year, max_year, '06-15', '07-15', geometry, index_list);
var split_drought = split_drought.split_drought(indices_col, lt_percent, antecedent_list, percentile_list, index_list);



// Test sensitivity_relative
// Usage: sensitivity.sensitivity_relative(split_indices, antecedent_list, percentile_list, index_list)
var sens_relative = sensitivity.sensitivity_relative(split_drought, antecedent_list, percentile_list, index_list);

// Test sensitivity_absolute
// Usage: sensitivity.sensitivity_absolute(split_indices, antecedent_list, percentile_list, index_list)
var sens_absolute = sensitivity.sensitivity_absolute(split_drought, antecedent_list, percentile_list, index_list);

print('Absolute sensitivity'); print(sens_absolute);
print('Relative sensitivity'); print(sens_relative);
Map.addLayer(lt_percent.select('CMI_ante3mo_lt_p10').first(), {min:0, max:1}, '2010 CMI lt 10th percentile 3 month antecedent');
Map.addLayer(split_drought.select('NDVI_ante3mo_p10_drought').mean(),  {min: -0.5, max:1}, '2010-2015 mean NDVI drought 10th percentile 3 month antecedent');
Map.addLayer(split_drought.select('NDVI_ante3mo_p10_base').mean(),  {min: -0.5, max:1}, '2010-2015 mean NDVI baseline 10th percentile 3 month antecedent', false);
Map.addLayer(sens_relative.select('Rel_sens_NDVI_ante3mo_p10'), rel_viz, '2010-2015 relative drought sensitivity NDVI 10th percentile 3 month antecedent');
Map.addLayer(sens_absolute.select('Abs_sens_NDVI_ante3mo_p10'), abs_viz, '2010-2015 absolute drought sensitivity NDVI 10th percentile 3 month antecedent', false);