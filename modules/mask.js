/*
Mask wrapper module
Alec L. Robitaille

*/



// Modules
var anthro = require('users/robitalec/CFS:modules/anthro.js');
var land_cover = require('users/francisv/landsat:modules/land_cover.js')
// var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var agriculture = require('users/francisv/CFS:modules/agriculture.js');
var fire = require('users/francisv/landsat:modules/fire.js');
// var ca_forest_fire_mag = ee.Image("projects/sat-io/open-datasets/CA_FOREST/CA_Forest_Wildfire_dNBR_1985_2020");



// Get masks
var world_settlement_area = anthro.world_settlement_area;
var agriculture = agriculture.agriculture;

var atemporal_mask = world_settlement_area.or(agriculture)
	.rename('atemporal_mask');
exports.atemporal_mask = atemporal_mask;



// Apply masks
var apply_masks = function(images) {
	return images.map(function(img) {
    var masked_img = img.updateMask(atemporal_mask.not());
    masked_img = fire.mask_five_year_fires(masked_img);
    masked_img = anthro.mask_harvest_year(masked_img);
    masked_img = land_cover.mask_land_cover(masked_img);
		return masked_img;
	});
};
exports.apply_masks = apply_masks;


