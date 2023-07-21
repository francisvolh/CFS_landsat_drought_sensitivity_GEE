/*
Main
Alec L. Robitaille
*/

// Load modules
var landsat = require('users/robitalec/CFS:modules/landsat.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
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

  // Collections
  var daymet = climate.daymet();
  var indices_col = landsat.indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, region);

  // Apply mask
  indices_col = mask.apply_masks(indices_col);


  // CMI
  var monthly_daymet = climate.monthly_daymet(daymet, years, months);
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

  // Drought/baseline
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
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
  }  else {
    throw new Error("output not one of 'relative sensitivity', 'absolute sensitivity', or 'vegetation index and antecedent means'");
  }


};
exports.main_greenest = main_greenest;



