exports.aggregateYears = function(years, images, reducer) {
  years.map(function(yr) {
    return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                 .reduce(reducer)
                 .set('year', yr);
  });
};