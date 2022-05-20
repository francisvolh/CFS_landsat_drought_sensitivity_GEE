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
40  Bryoids
80  Wetland
100 Herbs

-- Included --
50  Shrubs
81  Wetland Treed
210 Coniferous
220 Broad Leaf
230 Mixedwood
*/

// Load utils
var utils = require('users/robitalec/CFS:modules/utils.js');

// Load fire
var fire = require('users/robitalec/CFS:modules/fire.js');

// Load Hermosilla land cover
var hermosilla_2022 = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");
var lc_2019 = ee.Image(hermosilla_2022.filter(ee.Filter.date('2019-01-01')).first());
var lc_2020 = lc_2019
  .set('system:time_start', ee.Date(lc_2019.get('system:time_start')).advance(1, 'year').millis())
  .set('system:time_end', ee.Date(lc_2019.get('system:time_end')).advance(1, 'year').millis());
var hermosilla_plus_2022 = ee.ImageCollection(hermosilla_2022.toList(50).add(lc_2020));
exports.hermosilla_plus_2022 = hermosilla_plus_2022;

// Mask classes
var mask_classes = function(img) {
	return img.updateMask(
		img.expression('lc == 50 || lc == 81 || lc == 210 || lc == 220 || lc == 230',
		{lc: img.select('b1')})
	).select(['b1'], ['land_cover']);
};
exports.mask_classes = mask_classes;


// Get land cover collection
var get_land_cover = function() {
	return hermosilla_plus_2022.map(utils.set_year).map(mask_classes);
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
var mask_land_cover_and_fire = function(img) {
  var img_year = img.date().get('year');
  return img.updateMask(
		lc_and_fire.filter(ee.Filter.eq('year', img_year))
               .first()
               .mask());
};
exports.mask_land_cover_and_fire = mask_land_cover_and_fire;
exports.lc_and_fire = lc_and_fire;


// Mask heterogeneous
var mask_heterogeneous = function(img) {
  var foc_mean = img.focalMean(1, 'square', 'pixels');
  return img.mask(img.neq(foc_mean));
};
exports.mask_heterogeneous = mask_heterogeneous;


// Get homogeneous land cover collection
var get_homogeneous_land_cover = function() {
	return hermosilla_plus_2022
    .map(utils.set_year)
    .map(mask_heterogeneous)
    .map(mask_classes);
};
exports.get_homogeneous_land_cover = get_homogeneous_land_cover;

// Get focal mean band
var get_lc_focal_mean = function() {
  return hermosilla_plus_2022
    .reduce(ee.Reducer.mode())
    .focalMean(1, 'square', 'pixels')
    .map(mask_classes);
};
exports.get_lc_focal_mean = get_lc_focal_mean;
