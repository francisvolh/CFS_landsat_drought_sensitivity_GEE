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
        [[[-128.7288102930123, 63.004155935418076],
          [-128.7288102930123, 60.074728761978506],
          [-122.84013841801229, 60.074728761978506],
          [-122.84013841801229, 63.004155935418076]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/fire.js
Alec L. Robitaille
*/


// Load modules
var fire = require('users/robitalec/CFS:modules/fire.js');



// Test five_year_fires
// Usage: fire.five_year_fires(year)
var five_year_fires = fire.five_year_fires(2020);
print(five_year_fires);
Map.addLayer(five_year_fires, {min:0, max:1, palette: ['000000', 'ffc781']}, 'five_year_fires');

// Test mask_five_year_fires
// Usage: fire.mask_five_year_fires(img)
var img = ee.Image.random().clip(geometry).set('year', 2020);
var mask_five_year_fires = fire.mask_five_year_fires(img);
print(mask_five_year_fires);
Map.addLayer(mask_five_year_fires, null, 'mask_five_year_fires');



// Test sum_burned_buffer
// Usage: fire.sum_burned_buffer(focal_dist)
var focal_dist = 1000;
var sum_burned_buffer = fire.sum_burned_buffer(focal_dist);
print(sum_burned_buffer);
Map.addLayer(sum_burned_buffer, null, 'sum_burned_buffer');