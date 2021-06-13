// Land cover mask
exports.lcMask = function() {
  // Load GlobCover land cover
  var lc = ee.Image("ESA/GLOBCOVER_L4_200901_200912_V2_3");

  // Set land cover mask, only retaining if not one of
  return lc.updateMask(
    lc.expression('lc != 11 && lc != 14 && lc != 20 && lc != 30 && ' +
                  'lc != 120 && lc != 140 && lc != 190 && ' +
                  'lc != 200 && lc != 210 && lc != 220 && lc != 230',
                  {lc: lc.select('landcover')}))
      .select('landcover');
};
