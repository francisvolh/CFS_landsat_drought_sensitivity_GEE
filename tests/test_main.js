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
        [[[-140.73978380750106, 64.75408317982838],
          [-140.73978380750106, 64.12125497975113],
          [-138.7155528504698, 64.12125497975113],
          [-138.7155528504698, 64.75408317982838]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/main.js
Alec L. Robitaille
*/

// Load modules
var main = require('users/robitalec/CFS:modules/main.js');
var vars = require('users/robitalec/CFS:modules/variables.js');




// Viz
var ndvi_viz = {min:0.3, max:0.85};

// Map
Map.centerObject(geometry);
Map.setOptions('SATELLITE');



// Test main - index + antecedent means
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_index_and_antecedent = main.main_greenest('vegetation index and antecedent means', geometry);
print('veg index + antecedent means'); print(main_index_and_antecedent);
Map.addLayer(main_index_and_antecedent.select('CMI_ante3lag_mean').first(), vars.cmi_viz, 'CMI 3 yr lag antecedent mean', false);
Map.addLayer(main_index_and_antecedent.select('NDVI').first(), ndvi_viz, 'NDVI', false);

// Test main - relative
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_relative = main.main_greenest('relative sensitivity', geometry);
print('relative sensitivity'); print(main_relative);
Map.addLayer(main_relative.select('Rel_sens_NDVI_ante3lag_p15_p85'), vars.rel_viz, 'relative drought sensitivity NDVI p15-85 3 yr lag antecedent', false);


// Test main - absolute
// Usage: main_greenest(output, region, min_year, max_year, min_mm_dd, max_mm_dd, antecedent_list);
var main_absolute = main.main_greenest('absolute sensitivity', geometry);
print('absolute sensitivity'); print(main_absolute);
Map.addLayer(main_absolute.select('Abs_sens_NDVI_ante3lag_p15_p85'), vars.abs_viz, 'absolute drought sensitivity NDVI p15-85  3 yr lag antecedent');

