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
var split_drought = require('users/robitalec/CFS:modules/split_drought.js');
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');


var main = function(output, region, 
                    min_year, max_year, min_mm_dd, max_mm_dd, 
                    index_list, percentile_list, antecedent_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);
  
  if (typeof(antecedent_list)==='undefined') var antecedent_list = ['3mo', '12mo', '5yr'];
  // var antecedent_list = ['3mo', '12mo', '5yr'];

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
exports.main = main;




var main_cap = function(output, region, 
                    min_year, max_year, min_mm_dd, max_mm_dd, 
                    index_list, percentile_low, percentile_high, antecedent_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);
  var percentile_list = [percentile_low, percentile_high];
  
  if (typeof(antecedent_list)==='undefined') var antecedent_list = ['3mo', '12mo', '5yr'];
  // var antecedent_list = ['3mo', '12mo', '5yr'];

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
exports.main_cap = main_cap;

