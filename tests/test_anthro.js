/*
Testing: modules/anthro.js
Alec L. Robitaille
*/



// Load modules
var anthro = require('users/robitalec/CFS:modules/anthro.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');



// Variables
var lc_2015 = land_cover.hermosilla_1984_2019.filter(ee.Filter.date('2015-01-01')).first();
Map.addLayer(lc_2015, null, 'Land cover 2015');



// Test world_settlement_area
// Usage: anthro.world_settlement_area;
var world_settlement_area = anthro.world_settlement_area;
print('World Settlement Area', world_settlement_area);
Map.addLayer(world_settlement_area, {palette: '#CD6600', opacity: 0.8}, 'World Settlement Area');



// Test harvest_year
// Usage: anthro.harvest_year;
var harvest_year = anthro.harvest_year;
print('Harvest year', harvest_year);
Map.addLayer(harvest_year, {palette: ['#ffc0c0','#ff4545'], opacity: 0.8}, 'Harvest year');


// Test harvest_any
// Usage: anthro.harvest_any;
var harvest_any = anthro.harvest_any;
print('Harvest mask (any)', harvest_any);
Map.addLayer(harvest_any, {opacity: 0.8}, 'Harvest mask (any)');
