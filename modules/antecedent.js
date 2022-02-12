/*
Antecedent period
Alec L. Robitaille
*/


// Means of antecedent periods within years
var antecedent_means = function(images, band, year_list) {
  // Combine yearly images into a collection
  return ee.ImageCollection.fromImages(year_list.map(function(yr) {
    // Today - July 1
    var today = ee.Date.fromYMD(yr, 7, 1);

    // Setup output band names
    var band3mo = band + '_ante3mo';
    // var band6mo = band + '_ante6mo';
    var band12mo = band + '_ante12mo';
    var band5yr = band + '_ante5yr';
    var band5yrmean = band + '_ante5yr' + '_mean';

    return ee.Image([
      // Antecedent: 3 (months 3-6)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-3, 'month'), today))
            .select([band], [band3mo])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 6 (months 1-6)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      // images.filter(ee.Filter.date(today.advance(-6, 'month'), today))
      //       .select([band], [band6mo])
      //       .reduce(ee.Reducer.mean()),

      // Antecedent: 12 (months 6-6 year previous)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-1, 'year'), today))
            .select([band], [band12mo])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 5 (driest in previous 5 years)
      ee.ImageCollection([
        images.filter(ee.Filter.date(today.advance(-1, 'year'), today))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(today.advance(-2, 'year'), today.advance(-1, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(today.advance(-3, 'year'), today.advance(-2, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(today.advance(-4, 'year'), today.advance(-3, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(today.advance(-5, 'year'), today.advance(-4, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean())
        ]).reduce(ee.Reducer.min())
      ]).set({'year': yr});
  }));
};
exports.antecedent_means = antecedent_means;
