/*
Mask wrapper module
Alec L. Robitaille

*/



// Modules
var anthro = require('users/robitalec/CFS:modules/anthro.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var agriculture = require('users/robitalec/CFS:modules/agriculture.js');
var fire = require('users/robitalec/CFS:modules/fire.js');



// Get masks
var world_settlement_area = anthro.world_settlement_area;
var agriculture_mask = agriculture.agriculture_mask;
var min_land_cover_mask = land_cover.lc_count_mask();
var lc_transitions = land_cover.lc_transitions();

var atemporal_mask = min_land_cover_mask
  .updateMask(lc_transitions)
	.updateMask(world_settlement_area.not())
	.updateMask(agriculture_mask.not())
	.rename('atemporal_mask');
exports.atemporal_mask = atemporal_mask;



// Apply masks
var apply_mask = function(images) {
	return images.map(function(img) {
		return fire.mask_five_year_fires(img.updateMask(atemporal_mask));
	});
};
exports.apply_mask = apply_mask;
