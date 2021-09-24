// Land cover mask
// Value 	Description
// 11	Post-flooding or irrigated croplands
// 14	Rainfed croplands
// 20	Mosaic cropland (50-70%) / vegetation (grassland, shrubland, forest) (20-50%)
// 30	Mosaic vegetation (grassland, shrubland, forest) (50-70%) / cropland (20-50%)
// 40	Closed to open (>15%) broadleaved evergreen and/or semi-deciduous forest (>5m)
// 50	Closed (>40%) broadleaved deciduous forest (>5m)
// 60	Open (15-40%) broadleaved deciduous forest (>5m)
// 70	Closed (>40%) needleleaved evergreen forest (>5m)
// 90	Open (15-40%) needleleaved deciduous or evergreen forest (>5m)
// 100	Closed to open (>15%) mixed broadleaved and needleleaved forest (>5m)
// 110	Mosaic forest-shrubland (50-70%) / grassland (20-50%)
// 120	Mosaic grassland (50-70%) / forest-shrubland (20-50%)
// 130	Closed to open (>15%) shrubland (<5m)
// 140	Closed to open (>15%) grassland
// 150	Sparse (>15%) vegetation (woody vegetation, shrubs, grassland)
// 160	Closed (>40%) broadleaved forest regularly flooded - Fresh water
// 170	Closed (>40%) broadleaved semi-deciduous and/or evergreen forest regularly flooded - saline water
// 180	Closed to open (>15%) vegetation (grassland, shrubland, woody vegetation) on regularly flooded or waterlogged soil - fresh, brackish or saline water
// 190	Artificial surfaces and associated areas (urban areas >50%) GLOBCOVER 2009
// 200	Bare areas
// 210	Water bodies
// 220	Permanent snow and ice
// 230	Unclassified


// Load GlobCover land cover
var lc = ee.Image("ESA/GLOBCOVER_L4_200901_200912_V2_3");

// Set land cover mask, only retaining if not one of
var lcmask = lc.updateMask(
    lc.expression('lc != 11 && lc != 14 && lc != 20 && lc != 30 && ' +
                  'lc != 120 && lc != 140 && lc != 150 && lc != 10 && lc != 170 && lc != 180 && lc != 190 && ' +
                  'lc != 200 && lc != 210 && lc != 220 && lc != 230',
                  {lc: lc.select('landcover')}))
      .select('landcover');

exports.returnLc = function() {
	return lcmask;
};


exports.reverseMask = function() {
  return lcmask.mask().not().selfMask();
};




exports.maskLc = function(img) {
  return img.updateMask(lcmask);
};
