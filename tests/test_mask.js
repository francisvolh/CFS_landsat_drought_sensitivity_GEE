/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-129.64073621497684, 60.24163456752893],
          [-129.64073621497684, 59.25652750241089],
          [-126.03722058997684, 59.25652750241089],
          [-126.03722058997684, 60.24163456752893]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/mask.js
Alec L. Robitaille
*/



// Load modules
var mask = require('users/robitalec/CFS:modules/mask.js');
var human = require('users/robitalec/CFS:modules/human.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var agriculture = require('users/robitalec/CFS:modules/agriculture.js');
var fire = require('users/robitalec/CFS:modules/fire.js');
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');



// Variables
var img = ee.Image.constant(1);
var min_year = 2010;
var ndvi = get_landsat.get_indices_greenest(min_year, 2012, '07-01', '08-31', geometry);



// Map human, agriculture, land cover masks
Map.addLayer(ee.Image.constant(0), {palette: '#000000'}, 'Background');
Map.addLayer(human.world_settlement_area, {palette: '#ccc848', opacity: 0.5}, 'World Settlement Area');
Map.addLayer(agriculture.get_agriculture_mask, {palette: '#44bf3c', opacity: 0.5}, 'Agriculture');
Map.addLayer(land_cover.get_lc_count_mask().updateMask(land_cover.get_lc_count_mask().eq(0)), {palette: ['#945cd2', '#ffffff'], opacity: 0.5}, 'Land cover (min count)');
Map.addLayer(land_cover.lc_transitions(), null, 'Land cover transitions');


// Atemporal mask (without fire)
Map.addLayer(mask.atemporal_mask, null, 'Atemporal mask', false);




// Temporal mask: fire
Map.addLayer(fire.five_year_fires(min_year), {palette: ['#ffffff', '#ff5e5e'], opacity: 0.5}, 'Fires');




// Testing: apply_mask
// Usage: mask.apply_mask(images);
var masked_ndvi = mask.apply_mask(ndvi);
print('Masked NDVI', masked_ndvi);
Map.addLayer(masked_ndvi.select('NDVI'), null, 'Masked NDVI');