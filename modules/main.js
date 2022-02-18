/*
Main
Alec L. Robitaille
*/

// Load modules
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var fire = require('users/robitalec/CFS:modules/fire.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');




var main = function(output, region, 
                    min_year, max_year, min_mm_dd, max_mm_dd, 
                    index_list, percentile_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);
  var antecedent_list = ['3mo', '12mo', '5yr'];

  // Collections
  var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
  var indices_col = get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region.geometry(), index_list);

  // CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
  
  // Define drought  
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  var percentile_images = percentile.get_percentile(ante_means, percentile_list);
  var lt_percent = percentile.lt_percentile(ante_means, percentile_images);

  // Split vegetation index into baseline/drought
  var split_drought = split_drought.split_drought(indices_col, lt_percent, antecedent_list, percentile_list, index_list);

  // Calculate drought sensitivitity
  var sens_relative = sensitivity.sensitivity_relative(split_drought, antecedent_list, percentile_list, index_list);
  var sens_absolute = sensitivity.sensitivity_absolute(split_drought, antecedent_list, percentile_list, index_list);

  if (output == 'relative sensitivity') {
    
  } else if (output == 'absolute sensitivity') {
    
  } else if (output == 'vegetation index and antecedent means') {
    
  } 

};
exports.main = main;


// VEGETATION
// get indices: min_year, max_year, min_mm_dd, max_mm_dd, region, indices)

// SAMPLING
// stratified sample: N points

// CMI
// year list
// percentile list

// RETURN
// either antecedent means, or drought sensitivity

// Daymet
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);
// drought calc


var points = stratified.stratified_sample(lc, 'land_cover', ft.geometry(), 250);
var join = ee.Join.inner();
var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
joined = joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))});
var sampled = ee.ImageCollection(joined).map(function(img) {
  return img.reduceRegions(points, ee.Reducer.mean(), 30)
}).flatten();