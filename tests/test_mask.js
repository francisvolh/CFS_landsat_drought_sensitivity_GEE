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
        [[[-123.24669324622681, 56.67032058834609],
          [-123.24669324622681, 55.580421202979146],
          [-119.64317762122681, 55.580421202979146],
          [-119.64317762122681, 56.67032058834609]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/mask.js
Alec L. Robitaille
*/



// Load modules
var mask = require('users/robitalec/CFS:modules/mask.js');
var anthro = require('users/robitalec/CFS:modules/anthro.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var agriculture = require('users/robitalec/CFS:modules/agriculture.js');
var fire = require('users/robitalec/CFS:modules/fire.js');
var landsat = require('users/robitalec/CFS:modules/landsat.js');



// Variables
var img = ee.Image.constant(1);
var ndvi = landsat.indices_greenest(2010, 2012, '06-01', '08-31', geometry);



// Map anthro, agriculture masks
Map.addLayer(ee.Image.constant(0), {palette: '#000000'}, 'Background');
Map.addLayer(anthro.world_settlement_area, {palette: ['#000000', '#ccc848'], opacity: 0.3}, 'World Settlement Area');
Map.addLayer(agriculture.agriculture, {palette: ['#000000', '#44bf3c'], opacity: 0.3}, 'Agriculture');


// Atemporal mask
Map.addLayer(mask.atemporal_mask, {opacity: 0.3}, 'Atemporal mask', false);




// Temporal mask: fire, harvest
Map.addLayer(fire.five_year_fires(2011), {palette: ['#000000', '#ff5e5e'], opacity: 0.3}, '2011 fires');
Map.addLayer(anthro.harvest_year.eq(2011), {palette: ['#000000', '#ff5e5e'], opacity: 0.3}, '2011 harvest');



// Testing: apply_mask
// Usage: mask.apply_mask(images);
var masked_ndvi = mask.apply_mask(ndvi);
print('Masked NDVI', masked_ndvi);
Map.addLayer(masked_ndvi.select('NDVI'), null, 'Masked NDVI');
