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
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Set variables
var min_year = 1985; var max_year = 2015;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_low = 15;
var percentile_high = 85;
var percentile_list = [percentile_low, percentile_high];
var index_list = ['NDVI', 'EVI'];
var antecedent_list = ['3mo', '12mo', '5yr'];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};
var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Processing ---
// Collections
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
var indices_col = get_landsat.get_indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, geometry);

// Mask land cover and fires
indices_col = indices_col.map(land_cover.mask_land_cover_and_fire);

// CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Define drought
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list); 
var wi_percent = percentile.wi_percentile(ante_means, percentile_images);



// Test split_drought_wi
// Usage: split_drought.split_drought_wi(indices_col, wi_masks, antecedent_list, index_list)
var split_drought_wi = split.split_drought_wi(indices_col, wi_percent, antecedent_list, index_list);
print('Split drought withi'); print(split_drought_wi);
Map.addLayer(split_drought_wi.select('NDVI_ante3mo_p15_drought').first(),  {min: -0.5, max:1}, '2010 NDVI drought 15th percentile 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3mo_p15_base'),  {min: -0.5, max:1}, '2010 NDVI baseline 15th-85th percentile 3 month antecedent', false);
Map.centerObject(geometry);

