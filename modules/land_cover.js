/*
Land cover masks from Hermosilla et al. 2022 land cover
Alec L. Robitaille


High-resolution annual forest land cover maps for Canada's forested ecosystems (1984-2019)

0   Unclassified
20  Water
31  Snow/Ice
32  Rock/Rubble
33  Exposed/Barren Land
40  Bryoids
50  Shrubs
80  Wetland
81  Wetland Treed
100 Herbs
210 Coniferous
220 Broad Leaf
230 Mixedwood


Hermosilla, T., Wulder, M.A., White, J.C., Coops, N.C., 2022. Land cover
classification in an era of big and open data: Optimizing localized
implementation and training data selection to improve mapping outcomes.
Remote Sensing of Environment. No. 112780.
DOI: https://doi.org/10.1016/j.rse.2022.112780 [Open Access]


-- Excluded --
0   Unclassified
20  Water
31  Snow/Ice
32  Rock/Rubble
33  Exposed/Barren Land
80  Wetland


-- Included --
40  Bryoids
50  Shrubs
81  Wetland Treed
100 Herbs
210 Coniferous
220 Broad Leaf
230 Mixedwood
*/

// Modules
var utils = require('users/robitalec/CFS:modules/utils.js');
var fire = require('users/robitalec/CFS:modules/fire.js');



// Data
// Hermosilla land cover
var hermosilla_1984_2019 = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
exports.hermosilla_1984_2019 = hermosilla_1984_2019;



// Get land cover count mask mask
var get_lc_count_mask = function() {
  var lc_masked = hermosilla_1984_2019
    .map(utils.set_year)
    .map(mask_classes);
  var lc_masked_count = lc_masked.reduce(ee.Reducer.count()).eq(lc_masked.size());
  return hermosilla_1984_2019.mask().updateMask(lc_masked_count);
};
exports.get_lc_count_mask = get_lc_count_mask;


// Add 2020
var lc_2019 = ee.Image(hermosilla_1984_2019.filter(ee.Filter.date('2019-01-01')).first());
var lc_2020 = lc_2019
  .set('system:time_start', ee.Date(lc_2019.get('system:time_start')).advance(1, 'year').millis())
  .set('system:time_end', ee.Date(lc_2019.get('system:time_end')).advance(1, 'year').millis());
var hermosilla_1984_2019_plus_2020 = ee.ImageCollection(hermosilla_1984_2019.toList(50).add(lc_2020));
exports.hermosilla_1984_2019_plus_2020 = hermosilla_1984_2019_plus_2020;



// Mask classes
var mask_classes = function(img) {
	return img.updateMask(
		img.expression(
			'lc == 40 || lc == 50 || lc == 81 || lc == 100 || lc == 210 || lc == 220 || lc == 230',
		{lc: img.select('b1')})
	).select(['b1'], ['land_cover']);
};
exports.mask_classes = mask_classes;



// Get land cover collection
var get_land_cover = function() {
	return hermosilla_1984_2019_plus_2020.map(utils.set_year).map(mask_classes);
};
exports.get_land_cover = get_land_cover;



// (Local) get land cover collection
var lc = get_land_cover();

// Mask image with land cover
var mask_land_cover = function(img) {
  var img_year = img.date().get('year');
  return img.updateMask(
		lc.filter(ee.Filter.eq('year', img_year))
			.first()
			.mask());
};
exports.mask_land_cover = mask_land_cover;



// Mask image with land cover and fire
var lc_and_fire = lc.map(fire.mask_five_year_fires);
var zzz_mask_land_cover_and_fire = function(img) {
  var img_year = img.date().get('year');
  return img.updateMask(
		lc_and_fire.filter(ee.Filter.eq('year', img_year))
               .first()
               .mask());
};
exports.zzz_mask_land_cover_and_fire = zzz_mask_land_cover_and_fire;
exports.lc_and_fire = lc_and_fire;



// Mask heterogeneous
var n_pixels = 1.5;
var mask_heterogeneous = function(img) {
  var foc_mean = img.focalMean(n_pixels, 'square', 'pixels');
  return img.mask(img.eq(foc_mean));
};
exports.mask_heterogeneous = mask_heterogeneous;



// Get homogeneous land cover collection
var get_homogeneous_land_cover = function() {
	return hermosilla_1984_2019_plus_2020
    .map(utils.set_year)
    .map(mask_heterogeneous)
    .map(mask_classes);
};
exports.get_homogeneous_land_cover = get_homogeneous_land_cover;



// Get focal mean band
var get_lc_focal_mean = function() {
  return hermosilla_1984_2019_plus_2020
    .reduce(ee.Reducer.mode())
    .focalMean(n_pixels, 'square', 'pixels')
    .updateMask(lc_and_fire.reduce(ee.Reducer.mode()).mask());
};
exports.get_lc_focal_mean = get_lc_focal_mean;
