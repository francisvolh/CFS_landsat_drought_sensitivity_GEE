/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-140.9502089939156, 65.25678050686281],
          [-140.9502089939156, 64.04344020680696],
          [-137.3357070407906, 64.04344020680696],
          [-137.3357070407906, 65.25678050686281]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
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
var daymet = require('users/robitalec/CFS:modules/daymet.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var nobs = require('users/robitalec/CFS:modules/nobs.js');

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
var monthly_daymet = daymet.monthly_daymet(years, months);
var indices_col = get_landsat.get_indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, region);
indices_col = mask.apply_mask(indices_col);
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
ante_means = ante_means.filter(ee.Filter.gte('year', min_year_landsat));
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);
var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);
var sens_absolute = sensitivity.sensitivity_absolute_cap(split_drought_wi, antecedent_list, index_list);



// Test count_nobs
// Usage: nobs.count_nobs(split_indices, sensitivity);
var counts = nobs.count_nobs(split_drought_wi, sens_absolute);


// Test mask_nobs
// Usage: nobs.mask_nobs(type, counts, antecedent_list, index_list);
var mask_counts = nobs.mask_nobs('Abs', counts, antecedent_list, index_list);

print('Counts:', counts);
print('Mask counts:', mask_counts);

Map.centerObject(region);
Map.addLayer(ee.Image.constant(1), {palette: '#113355'}, 'constant');
Map.addLayer(counts.select('NDVI_ante3mo_wi_p15_p85_base_count'), {min: 0, max:30}, 'baseline count', false);
Map.addLayer(counts.select('NDVI_ante3mo_wi_p15_p85_base_count').gte(vars.min_baseline_nobs), null, 'baseline count gte ' + vars.min_baseline_nobs);
Map.addLayer(counts.select('NDVI_ante3mo_lte_p15_drought_count'), {min: 0, max:6}, 'drought count', false);
Map.addLayer(counts.select('NDVI_ante3mo_lte_p15_drought_count').gte(vars.min_drought_nobs), null, 'drought count gte ' + vars.min_drought_nobs);

Map.addLayer(mask_counts.select('Abs_sens_NDVI_ante3mo_p15_p85'), vars.abs_viz, 'sensitivity');
