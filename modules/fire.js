// Generate fire masks from fire polygons
var generateFireMasks = function(firepols, yr) {
  var date = ee.Date.fromYMD(yr, 1, 1);

  // Present year
  var y = date.get('year');

  // 5 years previous
  var ymin5 = date.advance(-4, 'year').get('year');

  // Filter fires within last 5 years
  // Reduce to any non zero = anywhere there is a fire
  // Result is 0 = no fire, 1 = fire
  return ee.Image([
    firepols.filter(ee.Filter.rangeContains('YEAR', ymin5, y))
            .reduceToImage(['YEAR'], ee.Reducer.anyNonZero())
            .rename('fire-in-last-5-years')
    ]).set('year', yr);
};

// Load NFDB fire polygons
var firepol = ee.FeatureCollection("users/robitalec/CFS/nbac_1986_to_2020_20210810");


// Mask fires
exports.maskFires = function(img) {
  var yr = img.date().get('year');

  var fire = generateFireMasks(firepol, yr).eq(0) //.first()?
  return(img.updateMask(fire));
}


// Archive -----
// Generate fire masks from fire polygons
exports.fireMasks = function(fires, years) {
  // Return image collection from images for each year's 5 year fire
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    // First of day of year
    var date = ee.Date.fromYMD(yr, 1, 1);

    // Present year
    var y = date.get('year');

    // 5 years previous
    var ymin5 = date.advance(-4, 'year').get('year');

    // Filter fires within last 5 years
    // Reduce to any non zero = anywhere there is a fire
    // Result is 0 = no fire, 1 = fire
    return ee.Image([
      fires.filter(ee.Filter.rangeContains('YEAR', ymin5, y))
          .reduceToImage(['YEAR'], ee.Reducer.anyNonZero())
          .rename('fire-in-last-5-years')
      ]).set('year', yr);
  }));
};
