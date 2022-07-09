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
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

// Set variables
var min_year = 1985; var max_year = 2015;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_low = 15;
var percentile_high = 85;
var percentile_list = [percentile_low, percentile_high];
var index_list = ['NDVI', 'NBR'];
var antecedent_list = ['3mo', '12mo', '5yr'];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};
var rel_viz = {min:-20, max:20, palette: palettes.colorbrewer.RdBu[5]};
var abs_viz = {min:-0.3, max:0.3, palette: palettes.colorbrewer.RdBu[5]};
var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Processing
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
var indices_col = get_landsat.get_indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, geometry);
indices_col = indices_col.map(land_cover.mask_land_cover_and_fire);
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list); 
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);
var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);



// Test sensitivity_relative_cap
// Usage: sensitivity.sensitivity_relative_cap(split_indices, antecedent_list, index_list)
var sens_relative = sensitivity.sensitivity_relative_cap(split_drought_wi, antecedent_list, index_list);

// Test sensitivity_absolute_cap
// Usage: sensitivity.sensitivity_absolute_cap(split_indices, antecedent_list, index_list)
var sens_absolute = sensitivity.sensitivity_absolute_cap(split_drought_wi, antecedent_list, index_list);

print('Absolute sensitivity', sens_absolute);
print('Relative sensitivity', sens_relative);
Map.addLayer(percentile_masks.select('CMI_ante3mo_lte_p15').first(), {min:0, max:1}, '2010 CMI lte p15th 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3mo_lte_p15_drought').mean(),  {min: -0.5, max:1}, '2010-2015 mean NDVI drought lte 15th 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3mo_wi_p15_p85_base').mean(),  {min: -0.5, max:1}, '2010-2015 mean NDVI baseline wi p15-85 3 month antecedent', false);
Map.addLayer(sens_relative.select('Rel_sens_NDVI_ante3mo_p15_p85'), rel_viz, '2010-2015 relative drought sensitivity NDVI p15-85 3 month antecedent', false);
Map.addLayer(sens_absolute.select('Abs_sens_NDVI_ante3mo_p15_p85'), abs_viz, '2010-2015 absolute drought sensitivity NDVI p15-85 3 month antecedent');



