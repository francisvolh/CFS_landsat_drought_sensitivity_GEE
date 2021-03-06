exports.fireMasks = function(fires, years) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    return ee.Image([
      fires.filter(ee.Filter.rangeContains('YEAR', yr - 5, yr))
           .reduceToImage(['YEAR'], ee.Reducer.anyNonZero())
           .eq(0)
           .rename('fire-in-last-5-years')
      ]).set('year', yr);
  }));
};