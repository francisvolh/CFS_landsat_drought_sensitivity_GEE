/*
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

// Data
// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");



// Functions
// Mask land cover, only retaining if not one of
var maskClasses = function(img) {
  return img.updateMask(
    img.expression('lc == 50 || lc == 81 || ' +
                   'lc == 210 || lc == 220 || lc == 230',
                  {lc: img.select('b1')}))
      .select(['b1'], ['land_cover']);
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
    classBand: 'land_cover',
    numPoints: n_pts,
    region: region
  }).map(function(ft) {
    return ft.setGeometry(ee.Geometry.Point([ft.get('longitude'), ft.get('latitude')]));
  });
};



