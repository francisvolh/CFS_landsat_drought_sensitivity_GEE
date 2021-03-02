exports.aggregateMRange = function(years, minmonth, maxmonth, images, reducer) {
  return ee.ImageCollection.fromImages(
    years.map(function(yr) {
      return months.map(function(mnth) {
        return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                     .filter(ee.Filter.calendarRange(minmonth, maxmonth, 'month'))
                     .reduce(reducer)
                     .set('year', yr)
                     .set('month', mnth)
                     .set('system:time_start',
                          ee.Date.fromYMD(yr, mnth, 1));
        });
  }).flatten()
  );
};

exports.aggregateMY = function(years, months, images, reducer) {
  return ee.ImageCollection.fromImages(
    years.map(function(yr) {
      return months.map(function(mnth) {
        return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                     .filter(ee.Filter.calendarRange(mnth, mnth, 'month'))
                     .reduce(reducer)
                     .set('year', yr)
                     .set('month', mnth)
                     .set('system:time_start',
                          ee.Date.fromYMD(yr, mnth, 1));
        });
  }).flatten()
  );
};

exports.aggregateY = function(years, images, reducer) {
  return ee.ImageCollection.fromImages(
    years.map(function(yr) {
      return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                   .reduce(reducer)
                   .set('year', yr)
                   .set('system:time_start',
                        ee.Date.fromYMD(yr, 1, 1));
    })
  );
};
