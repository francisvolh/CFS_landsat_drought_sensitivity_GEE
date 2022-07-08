/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');
var palettes = require('users/gena/packages:palettes');

// Set variables
var min_year = 1995;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile_low = 15;
var antecedent_list = ['3mo'];

var ndvi_viz = {min:0.3, max:0.85};
var rel_viz = {min:-50, max:50, palette: palettes.colorbrewer.RdBu[5]};
var abs_viz = {min:-0.5, max:0.5, palette: palettes.colorbrewer.RdBu[5]};
var cmi_viz = {min:-15, max:15, palette: palettes.colorbrewer.RdBu[5]};

// Load an ecoregion
var ecoregion = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .filter(ee.Filter.eq('ECOREGI', 136));



// Test main - index + antecedent means
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_index_and_antecedent = main.main_greenest('vegetation index and antecedent means', ecoregion, min_year, max_year, min_mm_dd, max_mm_dd, percentile_low, antecedent_list);
print('veg index + antecedent means'); print(main_index_and_antecedent);
Map.setOptions('SATELLITE');
Map.centerObject(ecoregion, 12);
Map.addLayer(main_index_and_antecedent.select('CMI_ante3mo_mean').first(), cmi_viz, '1995 CMI 3 month antecedent mean', false);
Map.addLayer(main_index_and_antecedent.select('NDVI').first(), ndvi_viz, '1995 NDVI', false);

// Test main - relative
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_relative = main.main_greenest('relative sensitivity', ecoregion, min_year, max_year, min_mm_dd, max_mm_dd, percentile_low, antecedent_list);
print('relative sensitivity'); print(main_relative);
Map.addLayer(main_relative.select('Rel_sens_NDVI_ante3mo_p15'), rel_viz, '1995-2015 relative drought sensitivity NDVI 15th percentile 3 month antecedent', false);


// Test main - absolute
// Usage: main(output, region, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
var main_absolute = main.main_greenest('absolute sensitivity', ecoregion, min_year, max_year, min_mm_dd, max_mm_dd, percentile_low, antecedent_list);
print('absolute sensitivity'); print(main_absolute);
Map.addLayer(main_absolute.select('Abs_sens_NDVI_ante3mo_p15'), abs_viz, '1995-2015 absolute drought sensitivity NDVI 15th percentile 3 month antecedent');
