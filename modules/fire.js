exports.fireMasks = function(fires, years) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    var yrMin5 = yr - 5

    // return ee.Image([
    //   fires.filter(ee.Filter.rangeContains('YEAR', yrMin5, yr))
    //       .reduceToImage(['YEAR'], ee.Reducer.anyNonZero())
    //       .rename('fire-in-last-5-years')
    //   ]).set('year', yr);
  }));
};