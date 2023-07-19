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
        [[[-129.70951037000103, 55.01366927692328],
          [-129.70951037000103, 54.16385633338348],
          [-127.68527941296978, 54.16385633338348],
          [-127.68527941296978, 55.01366927692328]]], null, false),
    geometry2 = /* color: #d63000 */ee.Geometry.Point([-128.71507601331157, 54.32903946310644]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var mask = require('users/robitalec/CFS:modules/mask.js');
var anthro = require('users/robitalec/CFS:modules/anthro.js');
var utils = require('users/robitalec/CFS:modules/utils.js');




// Viz
var ndvi_viz = {min:0.3, max:0.85};

// Map
Map.centerObject(geometry);
Map.setOptions('SATELLITE');
Map.addLayer(ee.Image.constant(1), {palette:'#000'});


// Test main - index + antecedent means
// TODO: remove extra args here
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_index_and_antecedent = main.main_greenest('vegetation index and antecedent means', geometry);
print('veg index + antecedent means'); print(main_index_and_antecedent);
Map.addLayer(main_index_and_antecedent.select('CMI_ante3yr_mean').first(), vars.cmi_viz, 'CMI 3 yr antecedent mean', false);
Map.addLayer(main_index_and_antecedent.select('NDVI').first(), ndvi_viz, 'NDVI', false);

// Test main - relative
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_relative = main.main_greenest('relative sensitivity', geometry);
print('relative sensitivity'); print(main_relative);
Map.addLayer(main_relative.select('Rel_sens_NDVI_ante3yr_p15_p85'), vars.rel_viz, 'relative drought sensitivity NDVI p15-85 3 yr lag antecedent', false);


// Test main - absolute
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_absolute = main.main_greenest('absolute sensitivity', geometry);
print('absolute sensitivity'); print(main_absolute);
Map.addLayer(main_absolute.select('Abs_sens_NDVI_ante3yr_p15_p85'), vars.abs_viz, 'absolute drought sensitivity NDVI p15-85  3 yr lag antecedent');



// Test error if output not one of options
var main_test_error = main.main_greenest('testing for error', geometry);



// Masks
Map.addLayer(anthro.harvest_any, {palette: ['ffffff','ff50ea'],opacity: 0.3}, 'Harvest mask (any)', false);
Map.addLayer(mask.atemporal_mask, {opacity: 0.3}, 'Atemporal mask', false);
