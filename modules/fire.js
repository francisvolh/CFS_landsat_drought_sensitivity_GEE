exports.fireMasks = function(fires, years) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    var date = ee.Date.fromYMD(yr, 1, 1)
    var y = date.get('year')
    var ymin5 = date.advance(-5, 'year').get('year')
    
    return ee.Image([
      fires.filter(ee.Filter.rangeContains('YEAR', ymin5, y))
          .reduceToImage(['YEAR'], ee.Reducer.anyNonZero())
          .rename('fire-in-last-5-years')
      ]).set('year', yr);
  }));
};