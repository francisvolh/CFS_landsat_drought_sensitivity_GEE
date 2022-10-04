/*
Testing: modules/split_drought.js
Alec L. Robitaille
*/

// Load modules
ee

// Set variables
var min_year = 1985; var max_year = 2020;
var min_year_landsat = min_year + 3;
var years = ee.List.sequence(min_year, max_year);
var months = ee.List.sequence(1, 12);
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_low = 15;
var percentile_high = 85;
var percentile_list = [percentile_low, percentile_high];
var index_list = ['NDVI', 'NBR'];
var antecedent_list = ['3mo', '12mo', '3yr', '1lag', '2lag', '3lag'];
var p = palettes.crameri.vik[10];
var cmi_viz = {min:-30, max:30, palette: p};
var geometry = ee.Geometry.Polygon([[[-125.87, 56.86], [-125.87, 54.98], [-121.87, 54.98], [-121.87, 56.86]]]);



// Processing ---
// Collections
var monthly_daymet = daymet.monthly_daymet(years, months);
var indices_col = get_landsat.get_indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, geometry);
indices_col = mask.apply_mask(indices_col);

// CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Define drought
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);

// Drop without sufficient lag
ante_means = ante_means.filter(ee.Filter.gte('year', min_year_landsat));

// Percentile
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);


// Test split_drought_wi
// Usage: split_drought.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list)
var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);
print('Split drought within', split_drought_wi);
Map.addLayer(split_drought_wi.select('NDVI_ante3yr_lte_p15_drought'),  {min: -0.5, max:1}, 'NDVI drought 15-85th 3 month antecedent');
Map.addLayer(split_drought_wi.select('NDVI_ante3yr_wi_p15_p85_base'),  {min: -0.5, max:1}, 'NDVI baseline 15th-85th 3 month antecedent', false);
Map.centerObject(geometry);

