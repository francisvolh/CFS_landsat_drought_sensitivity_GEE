/*
Utilities
Alec L. Robitaille
*/

// Set year
var set_year = function(img) {
	return img.set('year', img.date().get('year'));
};
exports.set_year = set_year;

// Set date
var set_date = function(img) {
	return img.set('system:time_start', img.date());
};
exports.set_date = set_date;

// Add year band 
var add_year_band = function(img) {
  return img.addBands([ee.Image.constant(img.get('year')).rename('year')]);
};
exports.add_year_band = add_year_band;

// Aggregate each month within each year with reducer
var aggregate_month_year = function(images, year_list, month_list, reducer) {
  // Combine images returned for each year+month
  return ee.ImageCollection.fromImages(
    // Map over years
    year_list.map(function(yr) {
      // Map over months
      return month_list.map(function(mnth) {
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
                          ee.Date.fromYMD(yr, mnth, 1).millis());
        });
  }).flatten()
  );
};
exports.aggregate_month_year = aggregate_month_year;



// Aggregate each year with reducer
var aggregrate_year = function(images, year_list, reducer) {
  // Combine images returned for each year
  return ee.ImageCollection.fromImages(
    // Map over years
    year_list.map(function(yr) {
      // Filter images to year
      // Reduce with reducer provided
      // Set year, month and pseudo date properties
      // Return an image for each year and month
      return images.filter(ee.Filter.calendarRange(yr, yr, 'year'))
                   .reduce(reducer)
                   .set('year', yr)
                   .set('system:time_start', ee.Date.fromYMD(yr, 1, 1).millis());
      }));
};
exports.aggregrate_year = aggregrate_year;



// Aggregate weekly
var week_list = ee.List.sequence(1, 53);
var aggregate_weekly = function(images, year_list) {
  var reducer = ee.Reducer.min().combine(ee.Reducer.max(), null, true);
  
  return ee.ImageCollection.fromImages(
  
    year_list.map(function(yr) {
      week_list.map(function(wk) {
        
        imgs = mean
        
        
        var syst_mean = aggregate_mean
        return images.filter(ee.Filter.calendarRange(wk, wk, 'week'))
                     .filter(ee.Filter.calendarRange(yr, yr, 'year'))
                     .reduce(reducer)
                     .set('week', wk)
                     .set('year', yr)
                     .set('system:time_start', ee.Date.fromYMD())
  })  
  )
}
