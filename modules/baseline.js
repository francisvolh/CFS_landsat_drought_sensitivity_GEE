// Means of antecedent periods within years
exports.antecedentMeans = function(images, band, years) {
  // Combine yearly images into a collection
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    // antemax - July 1
    var ante12max = ee.Date.fromYMD(yr, 7, 1);

    // Setup output band names
    var band3 = band + '_ante3';
    var band6 = band + '_ante6';
    var band12 = band + '_ante12';

    return ee.Image([
      // Antecedent: 3 (months 3-6)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.eq('year', yr))
            .filter(ee.Filter.rangeContains('month', 3, 6))
            .select([band], [band3])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 6 (months 1-6)      
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.eq('year', yr))
            .filter(ee.Filter.rangeContains('month', 1, 6))
            .select([band], [band6])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 12 (months 6-6 year previous)
      // Filter to year, and within antecedent period
      // Reduce with mean reducer
      images.filter(ee.Filter.date(ante12max.advance(-1, 'year'),
                                   ante12max))
              .select([band], [band12])
              .reduce(ee.Reducer.mean())
      ]).set('year', yr);
  }));
};

exports.gtPercentile = function(means, percentiles) {
  var percent3 = means.select(['CMI_ante3_mean'], ['CMI_gt_ante3']).reduce(ee.Reducer.percentile(percentiles));
  var percent6 = means.select(['CMI_ante6_mean'], ['CMI_gt_ante6']).reduce(ee.Reducer.percentile(percentiles));
  var percent12 = means.select(['CMI_ante12_mean'], ['CMI_gt_ante12']).reduce(ee.Reducer.percentile(percentiles));

  return means.map(function(img){
    return ee.Image([
      img.select('CMI_ante3_mean')
         .gt(percent3),
      img.select('CMI_ante6_mean')
         .gt(percent6),
      img.select('CMI_ante12_mean')
         .gt(percent12)]).copyProperties(img);
  });
};


