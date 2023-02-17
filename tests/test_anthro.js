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
        [[[-115.68478921035074, 54.78768079642482],
          [-115.68478921035074, 54.6373465157921],
          [-115.1217398939445, 54.6373465157921],
          [-115.1217398939445, 54.78768079642482]]], null, false);
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
var ndvi = landsat.indices_greenest(2010, 2012, '06-01', '09-31', Tegeometry);
Map.addLayer(ndvi, {min: -0.2, max: 0.9}, 'NDVI 2010-2012', false);

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
Map.addLayer(harvest_year, {palette: ['#ffc0c0','#be0900'], min: 1985, max:2020, opacity: 0.8}, 'Harvest year');


// Test harvest_any
// Usage: anthro.harvest_any;
var harvest_any = anthro.harvest_any;
print('Harvest mask (any)', harvest_any);
Map.addLayer(harvest_any, {opacity: 0.3}, 'Harvest mask (any)');




// Test mask_harvest_year
// Usage: anthro.mask_harvest_year;
var mask_harvest_ndvi = ndvi.map(anthro.mask_harvest_year);
print('Mask harvest NDVI', mask_harvest_ndvi);
Map.addLayer(mask_harvest_ndvi, {min: -0.2, max: 0.9, opacity: 0.8}, 'Mask harvest NDVI');