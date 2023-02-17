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
var agriculture_mask = agriculture.agriculture_mask;
var min_land_cover_mask = land_cover.lc_count_mask();
var lc_transitions = land_cover.lc_transitions();

var atemporal_mask = min_land_cover_mask
  .updateMask(lc_transitions)
	.updateMask(human_mask.unmask().not())
	.updateMask(agriculture_mask.unmask().not())
	.rename('atemporal_mask');
exports.atemporal_mask = atemporal_mask;



// Apply masks
var apply_mask = function(images) {
	return images.map(function(img) {
	  // TODO: mask land cover temporal too
		return fire.mask_five_year_fires(img.updateMask(atemporal_mask));
	});
};
exports.apply_mask = apply_mask;
