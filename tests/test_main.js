/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');
var palettes = require('users/gena/packages:palettes');

// Set variables
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile_list = [10, 20];
var index_list = ['NDVI', 'NBR'];
var rel_viz = {min:-50, max:50, palette: palettes.colorbrewer.RdBu[5]};
var abs_viz = {min:-0.5, max:0.5, palette: palettes.colorbrewer.RdBu[5]};
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};


// Load an ecoregion
var ecoregion = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .filter(ee.Filter.eq('ECOREGI', 136));


// Test main - index + antecedent means
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_index_and_antecedent = main.main('vegetation index and antecedent means', ecoregion, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
Map.addLayer(main_index_and_antecedent.select('CMI_ante3mo_mean').first(), cmi_viz, '2000 CMI 3 month antecedent mean');
Map.addLayer(main_index_and_antecedent.select('NDVI').first(), {min:-1, max:1}, '2000 NDVI');

// Test main - relative
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_relative = main.main('relative sensitivity', ecoregion, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
Map.addLayer(main_relative.select('Rel_sens_NDVI_ante3mo_p10'), rel_viz, '2000-2015 relative drought sensitivity NDVI 10th percentile 3 month antecedent');
Map.centerObject(ecoregion);

// Test main - absolute
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_absolute = main.main('absolute sensitivity', ecoregion, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
Map.addLayer(main_absolute.select('Abs_sens_NDVI_ante3mo_p10'), abs_viz, '2000-2015 absolute drought sensitivity NDVI 10th percentile 3 month antecedent');



