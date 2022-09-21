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



// Variables
var img = ee.Image.constant(1);



// Test
Map.addLayer(ee.Image.constant(0), {palette: '#000000'}, 'Background');
Map.addLayer(human.world_settlement_area, {palette: '#3486cc', opacity: 0.5}, 'World Settlement Area');
Map.addLayer(agriculture.get_agriculture_mask, {palette: '#44bf3c', opacity: 0.5}, 'Agriculture');
Map.addLayer(land_cover.get_lc_count_mask(), {palette: ['#945cd2', '#ffffff'], opacity: 0.5}, 'Land cover (min count)');

Map.addLayer(mask.atemporal_mask, null, 'Atemporal mask')
