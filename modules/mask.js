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
var agriculture = agriculture.agriculture;

var atemporal_mask = world_settlement_area.or(agriculture)
// 	.updateMask(agriculture)
	.rename('atemporal_mask');
exports.atemporal_mask = atemporal_mask;



// Apply masks
var apply_masks = function(images) {
	return images.map(function(img) {
    // img = img.updateMask(atemporal_mask);
    img = fire.mask_five_year_fires(img);
    img = anthro.mask_harvest_year(img);
		return img;
	});
};
exports.apply_masks = apply_masks;
