/*
Testing: modules/percentile.js
Alec L. Robitaille
*/

// Load modules
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var palettes = require('users/gena/packages:palettes');
var daymet = require('users/robitalec/CFS:modules/daymet.js');



// Set variables
var years = ee.List.sequence(2010, 2020);
var months = ee.List.sequence(1, 12);
var percentile_list = [15, 85];
var p = palettes.crameri.vik[10];
var cmi_viz = {min:-30, max:30, palette: p};


// Load collection
var monthly_daymet = daymet.monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

// Antecedent means
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);

// Drop without sufficient lag
ante_means = ante_means.filter(ee.Filter.gte('year', 2013));



// Test get_percentile
// Usage: get_percentile(images, percentile_list)
var percentile_images = percentile.get_percentile(ante_means, percentile_list);



print('Antecedent means', ante_means);
print('Percentile images', percentile_images);
Map.addLayer(ante_means.select('CMI_ante3lag_mean'), cmi_viz, '2013-2015 CMI 3 year lag antecedent means', false);
Map.addLayer(ante_means.select('CMI_ante3lag_mean').first(), cmi_viz, '2013 CMI 3 year lag antecedent means');
Map.addLayer(percentile_images.select('CMI_ante3lag_mean_p15'), cmi_viz, '2013-2015 CMI 15th percentile');
Map.addLayer(percentile_images.select('CMI_ante3lag_mean_p85'), cmi_viz, '2013-2015 CMI 85th percentile');



// Test get_percentile_masks
// Usage: get_percentile_masks(antecedent_images, percentile_images)
var percentile_masks = percentile.get_percentile_masks(ante_means, percentile_images);
print('Percentile masks', percentile_masks);
Map.addLayer(percentile_masks.select('CMI_ante3lag_wi_p15_p85').first(), {min:0, max:1}, '2013 CMI wi 15th-85th 3 year lag antecedent');
Map.addLayer(percentile_masks.select('CMI_ante3lag_lte_p15').first(), {min:0, max:1}, '2013 CMI lte 15th 3 year lag antecedent');



// Compare (>15 areas + with 15-85 areas = 0 (both drought), 1 (one baseline), 2 (both baseline)
Map.addLayer(percentile_masks.select('CMI_ante3lag_lte_p15').first().not()
                             .add(percentile_masks.select('CMI_ante3lag_wi_p15_p85').first()),
             null, '2013 CMI wi, lte agree 3 year lag antecedent', false);
