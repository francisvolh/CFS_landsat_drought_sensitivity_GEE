/*
Main
Alec L. Robitaille
*/

// Load modules
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var fire = require('users/robitalec/CFS:modules/fire.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var split = require('users/robitalec/CFS:modules/split_drought.js');
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var nobs = require('users/robitalec/CFS:modules/nobs.js');


var main_greenest = function(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list) {
  // Variables
  var percentile_low = vars.percentile_low;
  var percentile_high = vars.percentile_high;
  var index_list = vars.index_list;
  var years = ee.List.sequence(vars.min_year, vars.max_year);
  var months = vars.months;
  var percentile_list = [percentile_low, percentile_high];

  // Collections
  var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
  var lc_mask = land_cover.get_lc_count_mask();
  var indices_col = get_landsat.get_indices_greenest(min_year, max_year, min_mm_dd, max_mm_dd, region);
  
  // Fire and land cover masks
  indices_col = indices_col.map(function(img) {
    return fire.mask_five_year_fires(img.updateMask(lc_mask));
  });
              
  
  // CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
  
  // Drought/baseline
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  var percentile_images = percentile.get_percentile(ante_means, percentile_list); 
  var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);
  var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);

  if (output == 'relative sensitivity') {
    var sens_rel = sensitivity.sensitivity_relative_cap(split_drought_wi, antecedent_list, index_list);

    var counts_rel = nobs.count_nobs(split_drought_wi, sens_rel);
    return nobs.mask_nobs('Rel', counts_rel, antecedent_list, index_list);
  } else if (output == 'absolute sensitivity') {
    var sens_abs = sensitivity.sensitivity_absolute_cap(split_drought_wi, antecedent_list, index_list);

    var counts_abs = nobs.count_nobs(split_drought_wi, sens_abs);
    return nobs.mask_nobs('Abs', counts_abs, antecedent_list, index_list);
  } else if (output == 'vegetation index and antecedent means') {
    var join = ee.Join.inner();
    var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
    joined = ee.ImageCollection(joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))}));
    return joined;
  }

};
exports.main_greenest = main_greenest;





// ARCHIVE --------------------------------------------------------------------
var zzz_main = function(output, region,
                    min_year, max_year, min_mm_dd, max_mm_dd,
                    index_list, percentile_list, antecedent_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);

  // Collections
  var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
  var indices_col = get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region.geometry(), index_list);

  // Mask land cover and fires
  indices_col = indices_col.map(land_cover.mask_land_cover_and_fire);

  // CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

  // Define drought
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  var percentile_images = percentile.get_percentile(ante_means, percentile_list);
  var lt_percent = percentile.lt_percentile(ante_means, percentile_images);

  // Split vegetation index into baseline/drought
  var split = split_drought.split_drought(indices_col, lt_percent, antecedent_list, percentile_list, index_list);

  if (output == 'relative sensitivity') {
    return sensitivity.sensitivity_relative(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'absolute sensitivity') {
    return sensitivity.sensitivity_absolute(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'vegetation index and antecedent means') {
    var join = ee.Join.inner();
    var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
    joined = ee.ImageCollection(joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))}));

    return joined;
  }

};
exports.zzz_main = zzz_main;



var zzz_main_cap = function(output, region,
                    min_year, max_year, min_mm_dd, max_mm_dd,
                    index_list, percentile_low, percentile_high, antecedent_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);
  var percentile_list = [percentile_low, percentile_high];

  // Collections
  var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
  var indices_col = get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region.geometry(), index_list);

  // Mask land cover and fires
  indices_col = indices_col.map(land_cover.mask_land_cover_and_fire);

  // CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

  // Define drought
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  var percentile_images = percentile.get_percentile(ante_means, percentile_list);
  var lt_percent = percentile.lt_percentile(ante_means, percentile_images);

  // Split vegetation index into baseline/drought
  var split = split_drought.split_drought_cap(indices_col, lt_percent, antecedent_list, percentile_low, percentile_high, index_list);

  percentile_list = [percentile_low];
  if (output == 'relative sensitivity') {
    return sensitivity.sensitivity_relative(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'absolute sensitivity') {
    return sensitivity.sensitivity_absolute(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'vegetation index and antecedent means') {
    var join = ee.Join.inner();
    var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
    joined = ee.ImageCollection(joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))}));
    return joined;
  }

};
exports.zzz_main_cap = zzz_main_cap;

