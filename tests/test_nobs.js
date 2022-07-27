/*
Testing: modules/nobs.js
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
var fire = require('users/robitalec/CFS:modules/fire.js');
var nobs = require('users/robitalec/CFS:modules/nobs.js');

// Set variables
var min_year = 1985; var max_year = 2015;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_list = [15, 85];
var index_list = ['NDVI', 'NBR'];
var antecedent_list = ['3mo', '12mo', '5yr'];

var p = palettes.crameri.vik[10];
var cmi_viz = {min:-30, max:30, palette: p};
var rel_viz = {min:-20, max:20, palette: p};
var abs_viz = {min:-0.3, max:0.3, palette: p};

var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Processing
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
var indices_col = get_landsat.get_indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, geometry);
var lc_mask = land_cover.get_lc_count_mask();
indices_col = indices_col.map(function(img) {
  return fire.mask_five_year_fires(img.updateMask(lc_mask));
});
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);
var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);
var sens_absolute = sensitivity.sensitivity_absolute_cap(split_drought_wi, antecedent_list, index_list);



// Test count_nobs
// Usage: nobs.count_nobs(split_indices, sensitivity);
var counts = nobs.count_nobs(split_drought_wi, sens_absolute);

print('Counts:', counts);
Map.addLayer(geometry, null, 'region');
Map.addLayer(ee.Image.constant(1), {palette: '#113355'}, 'constant');
Map.addLayer(counts.select('NDVI_ante3mo_wi_p15_p85_base_count'), {min: 0, max:30}, 'baseline count');
Map.addLayer(counts.select('NDVI_ante3mo_wi_p15_p85_base_count').gte(10), null, 'baseline count gte 10');
Map.addLayer(counts.select('NDVI_ante3mo_lte_p15_drought_count'), {min: 0, max:6}, 'drought count');
Map.addLayer(counts.select('NDVI_ante3mo_lte_p15_drought_count').gte(3), null, 'drought count gte 3 ');

