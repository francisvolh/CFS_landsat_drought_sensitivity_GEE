exports.aggregateMonthsYears = function(years, images, reducer) {
  return ee.ImageCollection.fromImages(
    years.map(function(yr) {
      return months.map(function(mnth) {
        return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                     .filter(ee.Filter.calendarRange(mnth, mnth, 'month'))
                     .reduce(reducer)
                     .set('year', yr)
                     .set('month', mnth);
        });
  }).flatten()
  );
};

exports.aggregateYears = function(years, images, reducer) {
  return ee.ImageCollection.fromImages(
    years.map(function(yr) {
      return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                   .reduce(reducer)
                   .set('year', yr);
    })
  );
};
