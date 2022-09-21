/*
Mask wrapper module
Alec L. Robitaille

*/



// Modules
var human = require('users/robitalec/CFS:modules/human.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var agriculture = require('users/robitalec/CFS:modules/agriculture.js');
var fire = require('users/robitalec/CFS:modules/fire.js');



// Get masks
var human_mask = human.world_settlement_area;
var agriculture_mask = agriculture.get_agriculture_mask;
var min_land_cover_mask = land_cover.get_lc_count_mask();

var atemporal_mask = min_land_cover_mask
	.updateMask(human_mask.unmask().not())
	.updateMask(agriculture_mask.unmask().not())
	.rename('atemporal_mask')
	
exports.atemporal_mask = atemporal_mask;
// Function to update mask that will be mapped

