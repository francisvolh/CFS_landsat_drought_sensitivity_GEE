// Means of antecedent periods within years
exports.antecedentMeans = function(images, band, years) {
  // Combine yearly images into a collection
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    // antemax - July 1
    var ante12max = ee.Date.fromYMD(yr, 7, 1);

    // Setup output band names
    var band3mo = band + '_ante3mo';
    var band6mo = band + '_ante6mo';
    var band12mo = band + '_ante12mo';
    var band5yr = band + '_ante5yr';
    var band5yrmean = band + '_ante5yr' + '_mean';

    return ee.Image([
      // Antecedent: 3 (months 3-6)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.eq('year', yr))
            .filter(ee.Filter.rangeContains('month', 3, 6))
            .select([band], [band3mo])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 6 (months 1-6)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.eq('year', yr))
            .filter(ee.Filter.rangeContains('month', 1, 6))
            .select([band], [band6mo])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 12 (months 6-6 year previous)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(ante12max.advance(-1, 'year'),
                                   ante12max))
            .select([band], [band12mo])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 5 (driest in previous 5 years)
      ee.ImageCollection([
        images.filter(ee.Filter.date(ante12max.advance(-1, 'year'), ante12max))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(ante12max.advance(-2, 'year'), ante12max.advance(-1, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(ante12max.advance(-3, 'year'), ante12max.advance(-2, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(ante12max.advance(-4, 'year'), ante12max.advance(-3, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean()),
        images.filter(ee.Filter.date(ante12max.advance(-5, 'year'), ante12max.advance(-4, 'year')))
              .select([band], [band5yr])
              .reduce(ee.Reducer.mean())
        ]).reduce(ee.Reducer.min())
      ]).set({'year': yr});
  }));
};

// Compare percentile images for each antecedent period to each image's antecedent means
exports.ltPercentile = function(means, percentiles) {
  var percent3 = means.select(['CMI_ante3mo_mean'], ['CMI_lt_ante3mo']).reduce(ee.Reducer.percentile(percentiles));
  var percent6 = means.select(['CMI_ante6mo_mean'], ['CMI_lt_ante6mo']).reduce(ee.Reducer.percentile(percentiles));
  var percent12 = means.select(['CMI_ante12mo_mean'], ['CMI_lt_ante12mo']).reduce(ee.Reducer.percentile(percentiles));
  var percent5 = means.select(['CMI_ante5yr_mean_min'], ['CMI_lt_ante5yr']).reduce(ee.Reducer.percentile(percentiles));

  return means.map(function(img){
    return ee.Image([
      img.select('CMI_ante3mo_mean')
         .lt(percent3),
      img.select('CMI_ante6mo_mean')
         .lt(percent6),
      img.select('CMI_ante12mo_mean')
         .lt(percent12),
      img.select('CMI_ante5yr_mean_min')
         .lt(percent5)]).copyProperties(img);
  });
};


