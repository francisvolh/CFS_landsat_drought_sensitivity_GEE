// Aggregate each month within each year with reducer
exports.aggregateMY = function(years, months, images, reducer) {
  // Combine images returned for each year+month
  return ee.ImageCollection.fromImages(
    // Map over years
    years.map(function(yr) {
      // Map over months
      return months.map(function(mnth) {
        // Filter images to year and month
        // Reduce with reducer provided
        // Set year, month and pseudo date properties
        // Return an image for each year and month
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

// Aggregate years
exports.aggregateY = function(years, images, reducer) {
  // Combine images returned for each year
  return ee.ImageCollection.fromImages(
    // Map over years
    years.map(function(yr) {
      // Filter images to year
      // Reduce with reducer provided
      // Set year and pseudo date properties
      // Return an image for each year
      return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                   .reduce(reducer)
                  // .set('year', yr)
                  // .set('system:time_start', ee.Date.fromYMD(yr, 1, 1));
    })
  );
};


// (Not used at the moment) Aggregate monthly ranges
exports.aggregateMRange = function(years, minmonth, maxmonth, images, reducer) {
  // Combine images returned for each year
  return ee.ImageCollection.fromImages(
    // Map over years
    years.map(function(yr) {
      return months.map(function(mnth) {
      // Filter images to year and min/max month
      // Reduce with reducer provided
      // Set year, month and pseudo date properties
      // Return an image for each year
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