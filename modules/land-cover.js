// 0   Unclassified
// 20  Water
// 31  Snow/Ice
// 32  Rock/Rubble
// 33  Exposed/Barren Land
// 40  Bryoids
// 50  Shrubs
// 80  Wetland
// 81  Wetland Treed
// 100 Herbs
// 210 Coniferous
// 220 Broad Leaf
// 230 Mixedwood

// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');

// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");

lc = lc.map(landsatprep.setYear);


// Set land cover mask, only retaining if not one of
// TODO: map over collection
// var lcmask = lc.updateMask(
//     lc.expression('lc != 11 && lc != 14 && lc != 20 && lc != 30 && ' +
//                   'lc != 120 && lc != 140 && lc != 150 && lc != 160 && lc != 170 && lc != 180 && lc != 190 && ' +
//                   'lc != 200 && lc != 210 && lc != 220 && lc != 230',
//                   {lc: lc.select('landcover')}))
//       .select('landcover');

exports.returnLc = function() {
  // TODO: return collection
	return lcmask;
};


exports.reverseMask = function() {
  return lcmask.mask().not().selfMask();
};

exports.maskLc = function(img) {
  // TODO: add filter for year
  return img.updateMask(lcmask); 
};
