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


// Data
// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");



// Functions
// Mask land cover, only retaining if not one of
var maskLandCover = function(img) {
  return img.updateMask(
    img.expression('lc == 0 && lc != 20 && lc != 31 && lc != 32 && ' +
                  'lc != 33 && lc != 40 && lc != 80 && lc != 81 && lc != 100',
                  {lc: img.select('b1')}))
      .select('landcover');
};

// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');



// Processing
lc = lc.map(landsatprep.setYear)
       .map(maskLandCover);
       
       

/// Exports
exports.returnLc = function() {
  // TODO: return collection
	return lcmask;
};


exports.reverseMask = function() {
  return lcmask.mask().not().selfMask();
};

exports.maskLc = function(img) {
  // TODO: add filter for year
  return img.updateMask(lcmask.filter(ee.Filter.eq('year', img.date().get('year')))); 
};
