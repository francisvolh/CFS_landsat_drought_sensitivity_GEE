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
    var band12mo = band + '_ante12mo';
    var band3yr = band + '_ante3yr';
    var band1lag = band + '_ante1lag';
    var band2lag = band + '_ante2lag';
    var band3lag = band + '_ante3lag';


    return ee.Image([
      // Antecedent: 3 months 3-6
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-3, 'month'), today))
            .select([band], [band3mo])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 12 months 6-6
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-1, 'year'), today))
            .select([band], [band12mo])
            .reduce(ee.Reducer.mean()),


      // Antecedent: 3 years 6-6
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-3, 'year'), today))
            .select([band], [band3yr])
            .reduce(ee.Reducer.mean()),


      // Antecedent: 12 month, 1 year lag
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-2, 'year'), today.advance(-1, 'year')))
            .select([band], [band1lag])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 12 month, 2 year lag
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-3, 'year'), today.advance(-2, 'year')))
            .select([band], [band2lag])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 12 month, 3 year lag
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(today.advance(-4, 'year'), today.advance(-3, 'year')))
            .select([band], [band3lag])
            .reduce(ee.Reducer.mean()),

      ]).set({'year': yr});
  }));
};
exports.antecedent_means = antecedent_means;
