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
var maskClasses = function(img) {
  return img.updateMask(
    img.expression('lc != 0 && lc != 20 && lc != 31 && lc != 32 && ' +
                   'lc != 33 && lc != 40 && lc != 80 && lc != 100',
                  {lc: img.select('b1')}))
      .select(['b1'], ['land-cover']);
};

// Landsat prep functions
var landsatprep = require('users/robitalec/CFS:modules/landsat-prep.js');


// Processing
lc = lc.map(landsatprep.setYear)
       .map(maskClasses);


/// Exports
exports.returnLandCover = function() {
	return lc;
};


// exports.reverseMask = function() {
//   return lcmask.mask().not().selfMask();
// };
exports.maskLandCover = function(img) {
  var date = img.date();
  return img.updateMask(lc.filterDate(date, date.advance(1, 'year')).first());
};



// Return 1985, 2002, 2019
exports.returnLandCoverSample = function() {
 return ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2")
              .map(landsatprep.setYear)
              .filter(ee.Filter.inList('year', [1985, 2002, 2019]))
              .toBands();
};


// Stratified sampling
var lc_2002 = lc.filter(ee.Filter.eq('year', 2002)).first();

// Note unless seed is changed, always same points
exports.stratifiedSample = function(region, n_pts) {
  return lc_2002.addBands([ee.Image.pixelLonLat()]).stratifiedSample({
    classBand: 'land-cover',
    numPoints: n_pts,
    region: region
  }).map(function(ft) {
    return ft.setGeometry(ee.Geometry.Point([ft.get('longitude'), ft.get('latitude')]));
  });
};



