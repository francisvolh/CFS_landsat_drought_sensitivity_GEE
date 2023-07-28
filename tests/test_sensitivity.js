/*
Testing: modules/sensitivity.js
Alec L. Robitaille
*/



// Load modules
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');
var split = require('users/robitalec/CFS:modules/split_drought.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var climate = require('users/robitalec/CFS:modules/climate.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var landsat = require('users/robitalec/CFS:modules/landsat.js');
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



// Processing
var monthly_daymet = climate.monthly_daymet(years, months);
var indices_col = landsat.indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, region);
indices_col = mask.apply_masks(indices_col);
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
ante_means = ante_means.filter(ee.Filter.gte('year', min_year_landsat));
var percentile_images = percentile.percentile(ante_means, percentile_list);
var percentile_masks = percentile.percentile_masks(ante_means, percentile_images);
var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);



// Test sensitivity_relative_cap
// Usage: sensitivity.sensitivity_relative_cap(split_indices, antecedent_list, index_list)
var sens_relative = sensitivity.sensitivity_relative_cap(split_drought_wi, antecedent_list, index_list);

// Test sensitivity_nd_cap
// Usage: sensitivity.sensitivity_nd_cap(split_indices, antecedent_list, index_list)
var sens_nd = sensitivity.sensitivity_nd_cap(split_drought_wi, antecedent_list, index_list);

// Test sensitivity_absolute_cap
// Usage: sensitivity.sensitivity_absolute_cap(split_indices, antecedent_list, index_list)
var sens_absolute = sensitivity.sensitivity_absolute_cap(split_drought_wi, antecedent_list, index_list);



print('Absolute sensitivity', sens_absolute);
print('Relative sensitivity', sens_relative);
print('Normalized difference sensitivity', sens_nd);

Map.centerObject(region);
Map.addLayer(percentile_masks.select('CMI_ante3mo_lte_p15').first(), {min:0, max:1}, 'CMI lte p15th 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3mo_lte_p15_drought').mean(),  {min: -0.5, max:1}, 'mean NDVI drought lte 15th 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3mo_wi_p15_p85_base').mean(),  {min: -0.5, max:1}, 'mean NDVI baseline wi p15-85 3 month antecedent', false);
Map.addLayer(sens_relative.select('Rel_sens_NDVI_ante3mo_p15_p85'), vars.rel_viz, 'relative drought sensitivity NDVI p15-85 3 month antecedent', false);
Map.addLayer(sens_absolute.select('Abs_sens_NDVI_ante3mo_p15_p85'), vars.abs_viz, 'absolute drought sensitivity NDVI p15-85 3 month antecedent');
Map.addLayer(sens_nd.select('ND_sens_NDVI_ante3mo_p15_p85'), vars.abs_viz, 'normalized difference drought sensitivity NDVI p15-85 3 month antecedent');
