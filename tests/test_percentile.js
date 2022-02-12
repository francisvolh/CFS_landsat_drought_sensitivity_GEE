/*
Testing: modules/percentile.js
Alec L. Robitaille
*/

// Load percentile module
var percentile = require('users/robitalec/CFS:modules/percentile.js');

// Load antecedent module
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');

// Load CMI module
var cmi = require('users/robitalec/CFS:modules/cmi.js');

// Load palettes module
var palettes = require('users/gena/packages:palettes');
var pal = palettes.colorbrewer.RdBu[5];

// Load get_daymet module
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set years, months
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(1, 12);

// Get Daymet collection
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Antecedent means
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);

// Percentile list
var percentile_list = [5, 10];

// Test get_percentile
// Usage: get_percentile(images, percentile_list)
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
print(percentile_images);
Map.addLayer(ante_means.select('CMI_ante3mo_mean').first(), {min:-30, max:30, palette: pal}, '2010 CMI 3 month antecedent means');
Map.addLayer(percentile_images.select('CMI_ante3mo_mean_p10'), {min:-30, max:30, palette: pal}, '2010-2015 CMI 10th percentile');

// Test lt_percentile
// Usage: lt_percentile(means, percentile_list)
// var lt_percent = percentile.lt_percentile(ante_means, percentile_list);
// print(lt_percent);
// Map.addLayer(ante_means.select('CMI_ante3mo_mean'), {min:-30, max:30, palette: pal});
// Map.addLayer(lt_percent.select('CMI_ante3mo_lt_p10').limit(-1), {min:0, max:0});
