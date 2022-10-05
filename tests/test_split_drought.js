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
var daymet = require('users/robitalec/CFS:modules/daymet.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Variables
var index_list = vars.index_list;
var antecedent_list = vars.ante_list;
var min_year_daymet =  vars.min_year_daymet;
var min_year_landsat =  vars.min_year_landsat;
var max_year = vars.max_year;
var min_mm_dd = vars.min_mm_dd;
var max_mm_dd = vars.max_mm_dd;
var percentile_low = vars.percentile_low;
var percentile_high = vars.percentile_high;
var months = vars.months;
var years = ee.List.sequence(min_year_daymet, max_year);
var percentile_list = [percentile_low, percentile_high];
var region = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Collections
var monthly_daymet = daymet.monthly_daymet(years, months);
var indices_col = get_landsat.get_indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, region);

// Apply mask
indices_col = mask.apply_mask(indices_col);

// CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Drought/baseline
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
ante_means = ante_means.filter(ee.Filter.gte('year', min_year_landsat));

var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);



// Test split_drought_wi
// Usage: split_drought.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list)
var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);
print('Split drought within', split_drought_wi);
Map.addLayer(split_drought_wi.select('NDVI_ante3yr_lte_p15_drought'),  {min: -0.5, max:1}, 'NDVI drought 15-85th 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3yr_wi_p15_p85_base'),  {min: -0.5, max:1}, 'NDVI baseline 15th-85th 3 month antecedent', false);
Map.centerObject(region);
