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
        [[[-129.189733058007, 54.86520771482404],
          [-129.189733058007, 54.30136055441283],
          [-127.80408242324137, 54.30136055441283],
          [-127.80408242324137, 54.86520771482404]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/anthro.js
Alec L. Robitaille
*/



// Load modules
var anthro = require('users/robitalec/CFS:modules/anthro.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var landsat = require('users/robitalec/CFS:modules/landsat.js');



// Data
// NDVI example
var min_yr = 2020;
var max_yr = 2022;
var ndvi = landsat.indices_greenest(min_yr, max_yr, '06-01', '08-31', geometry);
Map.addLayer(ndvi.select('NDVI'), {min: -0.2, max: 0.9}, 'NDVI ', + min_yr + '-' + max_yr, false);

var lc_2015 = land_cover.hermosilla_1984_2019.filter(ee.Filter.date('2015-01-01')).first();
Map.addLayer(lc_2015, null, 'Land cover 2015', false);



// Test world_settlement_area
// Usage: anthro.world_settlement_area;
var world_settlement_area = anthro.world_settlement_area;
print('World Settlement Area', world_settlement_area);
Map.addLayer(world_settlement_area, {palette: '#2635a1', opacity: 0.8}, 'World Settlement Area');



// Test harvest_year
// Usage: anthro.harvest_year;
var harvest_year = anthro.harvest_year;
print('Harvest year', harvest_year);
Map.addLayer(harvest_year, {palette: ['#ffc0c0','#be0900', '#000000'], min: 1985, max:2020, opacity: 0.8}, 'Harvest year');


// Test harvest_any
// Usage: anthro.harvest_any;
var harvest_any = anthro.harvest_any;
print('Harvest mask (any)', harvest_any);
Map.addLayer(harvest_any, {opacity: 0.3}, 'Harvest mask (any)', false);



// Test mask_harvest_year
// Usage: anthro.mask_harvest_year;
var mask_harvest_ndvi = ndvi.map(anthro.mask_harvest_year);
print('Mask harvest NDVI', mask_harvest_ndvi);
var yr = 2020;
Map.addLayer(harvest_year.eq(yr), {opacity: 0.8}, 'Harvest mask year ' + yr, false);
Map.addLayer(mask_harvest_ndvi.select('NDVI'), {min: -0.2, max: 0.9}, 'Mask harvest NDVI');
