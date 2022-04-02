/*
Testing: modules/split_drought.js
Alec L. Robitaille
*/

// Load modules
var split = require('users/robitalec/CFS:modules/split_drought.js');
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
var percentile_low = 15;
var percentile_high = 85;
var percentile_list = [percentile_low, percentile_high];
var index_list = ['NDVI', 'EVI'];
var antecedent_list = ['3mo', '12mo', '5yr'];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};
var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Processing
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);
var indices_col = get_landsat.get_indices(min_year, max_year, '06-15', '07-15', geometry, index_list);



// Test split_drought
// Usage: split_drought.split_drought(indices_col, lt_percent, antecedent_list, percentile_list, index_list)
var split_drought = split.split_drought(indices_col, lt_percent, antecedent_list, percentile_list, index_list);
print('Less than percentile'); print(lt_percent);
Map.addLayer(lt_percent.select('CMI_ante3mo_lt_p15').first(), {min:0, max:1}, '2010 CMI lt 15th percentile 3 month antecedent', false);
print('Split drought'); print(split_drought);
Map.addLayer(indices_col.select('NDVI'), null, '2010-2015 NDVI', false);
Map.addLayer(split_drought.select('NDVI_ante3mo_p15_drought').first(),  {min: -0.5, max:1}, '2010 NDVI drought 15th percentile 3 month antecedent');
Map.addLayer(split_drought.select('NDVI_ante3mo_p15_base').first(),  {min: -0.5, max:1}, '2010 NDVI baseline 15th percentile 3 month antecedent', false);




// Test split_drought_cap
// Usage: split_drought_cap.split_drought_cap(indices_col, lt_percent, antecedent_list, percentile_low, percentile_high, index_list)
var split_drought_cap = split.split_drought_cap(indices_col, lt_percent, antecedent_list, 15, 85, index_list);
print('Split drought  with cap'); print(split_drought_cap);
Map.addLayer(split_drought_cap.select('NDVI_ante3mo_p15_drought').first(),  {min: -0.5, max:1}, '2010 NDVI drought 15th percentile 3 month antecedent');
Map.addLayer(split_drought_cap.select('NDVI_ante3mo_p15_base').first(),  {min: -0.5, max:1}, '2010 NDVI baseline 15th-85th percentile 3 month antecedent', false);
Map.centerObject(geometry);