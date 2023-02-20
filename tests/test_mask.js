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
        [[[-130.2669569181018, 55.14330923396935],
          [-130.2669569181018, 54.009927567389006],
          [-126.66344129310181, 54.009927567389006],
          [-126.66344129310181, 55.14330923396935]]], null, false),
    geometry2 = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-123.05835231031519, 49.9486191374145],
          [-123.05835231031519, 48.477525056371434],
          [-118.20239527906519, 48.477525056371434],
          [-118.20239527906519, 49.9486191374145]]], null, false);
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
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");

// Map land cover
Map.addLayer(lc, null, 'Land cover');
Map.addLayer(land_cover.mask_classes(lc), null, 'Land cover - masked');

// Map anthro, agriculture masks
// Map.addLayer(ee.Image.constant(0), {palette: '#000000'}, 'Background');
// Map.addLayer(anthro.world_settlement_area, {palette: ['#000000', '#ccc848'], opacity: 0.3}, 'World Settlement Area');
// Map.addLayer(agriculture.agriculture, {palette: ['#000000', '#44bf3c'], opacity: 0.3}, 'Agriculture');


// Atemporal mask
Map.addLayer(mask.atemporal_mask.not(), {opacity: 0.3}, 'Atemporal mask', false);




// Temporal mask: fire, harvest
// Map.addLayer(fire.five_year_fires(2011), {palette: ['#000000', '#ff5e5e'], opacity: 0.3}, '2011 fires');
// Map.addLayer(anthro.harvest_year, {palette: ['#ffc0c0','#be0900', '#000000'], min: 1985, max:2020, opacity: 0.8}, 'Harvest year', false);
// Map.addLayer(anthro.harvest_year.eq(2011), {palette: ['#000000', '#5eb5ff'], opacity: 0.3}, '2011 harvest');



// Testing: apply_masks
// Usage: mask.apply_masks(images);
var masked_ndvi = mask.apply_masks(ndvi);
print('Masked NDVI', masked_ndvi);
// Map.addLayer(masked_ndvi.select('NDVI'), {opacity: 0.5}, 'Masked NDVI');


// Testing mask masks USA
var ndvi_geo2 = landsat.indices_greenest(2010, 2012, '06-01', '08-31', geometry2);
Map.addLayer(ndvi_geo2.select('NDVI'), {opacity: 0.5}, 'NDVI - geometry2', false);
var masked_ndvi_geo2 = mask.apply_masks(ndvi_geo2);
Map.addLayer(masked_ndvi_geo2.select('NDVI'), null, 'Masked NDVI - geometry2');

