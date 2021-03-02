exports.antecedentPercentile = function(years, images, band, percentiles) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    // antemax - July 1
    var ante12max = ee.Date.fromYMD(yr, 7, 1);

    var band3 = band + '_ante3';
    var band6 = band + '_ante6';
    var band12 = band + '_ante12';

    return ee.Image([

      // Antecedent: 3 (months 3-6)
      images.filter(ee.Filter.eq('year', yr))
            .filter(ee.Filter.rangeContains('month', 3, 6))
            .select([band], [band3])
            .reduce(ee.Reducer.percentile(percentiles)),

      // Antecedent: 6 (months 1-6)
      images.filter(ee.Filter.eq('year', yr))
              .filter(ee.Filter.rangeContains('month', 1, 6))
              .select([band], [band6])
              .reduce(ee.Reducer.percentile(percentiles)),

      // Antecedent: 12 (months 6-6 year previous)
      images.filter(ee.Filter.date(ante12max.advance(-1, 'year'),
                                   ante12max))
              .select([band], [band12])
              .reduce(ee.Reducer.percentile(percentiles))
      ]).set('year', yr);
  }));
};

exports.gtPercentile = function(meanImgs, percentileImgs) {
  var band3 = 'gt_ante3_CMI';
  var band6 = 'gt_ante6_CMI';
  var band12 = 'gt_ante12_CMI';

  return ee.Image([
      img.select('CMI'),
      img.select('CMI')
         .gt(means.select(['CMI_ante3_mean'], [band3])),
        // .rename(band3),
      img.select('CMI')
         .gt(means.select('CMI_ante6_mean'))
         .rename(band6),
      img.select('CMI')
         .gt(means.select('CMI_ante12_mean'))
         .rename(band12)]);
};


