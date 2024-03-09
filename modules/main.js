/*
Main
Alec L. Robitaille
*/

// Load modules
var landsat = require('users/robitalec/CFS:modules/landsat.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var cmi_era5 = require('users/robitalec/CFS:modules/cmi_era5.js');
var climate = require('users/robitalec/CFS:modules/climate.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var split = require('users/robitalec/CFS:modules/split_drought.js');
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var nobs = require('users/robitalec/CFS:modules/nobs.js');


var main_greenest = function(output, region) {
  // Variables
  var index_list = vars.index_list;
	var antecedent_list = vars.ante_list;
	var min_year_climate =  vars.min_year_climate;
	var min_year_landsat =  vars.min_year_landsat;
	var max_year = vars.max_year;
  var min_month_climate = vars.min_month_climate;
  var max_month_climate = vars.max_month_climate;
  var years = ee.List.sequence(min_year_climate, max_year);
	var min_mm_dd = vars.min_mm_dd;
	var max_mm_dd = vars.max_mm_dd;
	var percentile_low = vars.percentile_low;
	var percentile_high = vars.percentile_high;
  var percentile_list = [percentile_low, percentile_high];

  // Collections
  var indices_col = landsat.indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, region);

  // Apply mask
  indices_col = mask.apply_masks(indices_col);


  // CMI
  var monthly_era5 = climate.monthly_era5(min_year_climate, max_year, min_month_climate, max_month_climate);
  var cmi = monthly_era5.map(cmi_era5.calc_CMI_ERA5);

  // Drought/baseline
  var ante_means = antecedent.antecedent_means(cmi, 'CMI', years);
  ante_means = ante_means.filter(ee.Filter.gte('year', min_year_landsat));

  var percentile_images = percentile.percentile(ante_means, percentile_list);
  var percentile_masks = percentile.percentile_masks(ante_means, percentile_images);
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
  } else if (output == 'normalized difference sensitivity') {
    var sens_nd = sensitivity.sensitivity_nd_cap(split_drought_wi, antecedent_list, index_list);

    var counts_nd = nobs.count_nobs(split_drought_wi, sens_nd);
    return nobs.mask_nobs('ND', counts_nd, antecedent_list, index_list);
  }


};
exports.main_greenest = main_greenest;
