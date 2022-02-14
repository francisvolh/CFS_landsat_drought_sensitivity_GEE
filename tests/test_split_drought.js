/*
Testing: modules/split_drought.js
Alec L. Robitaille
*/

// Load modules
var split_drought = require('users/robitalec/CFS:modules/split_drought.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Set variables
var years = ee.List.sequence(2010, 2015);
var months = ee.List.sequence(1, 12);
var percentile_list = [5, 10];
var cmi_viz = {min:-30, max:30, palette: palettes.colorbrewer.RdBu[5]};

// Load collection
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);



// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Antecedent means
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);

// Percentile masks
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);




// Test split_drought
// Usage: split_drought.split_drought(image) 
var split_drought = function(images, percentile_masks, antecedent_list, percentile_list, index_list) {



print('Less than percentile'); print(lt_percent);
Map.addLayer(lt_percent.select('CMI_ante3mo_mean_p10').first(), {min:0, max:1}, '2010 CMI lt 10th percentile 3 month antecedent');

