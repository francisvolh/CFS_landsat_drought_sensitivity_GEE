// Means of antecedent periods within years
exports.antecedentMeans = function(images, band, years) {
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
            .reduce(ee.Reducer.mean()),

      // Antecedent: 6 (months 1-6)
      images.filter(ee.Filter.eq('year', yr))
            .filter(ee.Filter.rangeContains('month', 1, 6))
            .select([band], [band6])
            .reduce(ee.Reducer.mean()),

      // Antecedent: 12 (months 6-6 year previous)
      images.filter(ee.Filter.date(ante12max.advance(-1, 'year'),
                                   ante12max))
              .select([band], [band12])
              .reduce(ee.Reducer.mean())
      ]).set('year', yr);
  }));
};


// Percentile across years
exports.gtPercentile = function(images, means, percentile) {
  return means.map(function(img) {
    var band3 = 'gt_CMI_ante3';
    var band6 = 'gt_CMI_ante6';
    var band12 = 'gt_CMI_ante12';

    return ee.Image([
      img.select('CMI'),

      img.select(['CMI'], [band3])
         .gt(means.select('CMI_ante3_mean')),
        // .rename(band3),

      img.select('CMI')
         .gt(means.select('CMI_ante6_mean'))
         .rename(band6),
         
      img.select('CMI')
         .gt(means.select('CMI_ante12_mean'))
         .rename(band12)
      ]).set('year', yr);
  });
};

// exports.gtPercentiles = function(cmiImages, cmiBand, percentileImages) {
//   return ee.ImageCollection(percentileImages.map(function(percentImg) {
//     var yr = percentImg.get('year');
    
//     // Compare percentile images to July of each year
//     var filtCMI = cmiImages.filter(ee.Filter.eq('year', yr))
//                           .filter(ee.Filter.eq('month', 7));

//     return filtCMI.map(function(cmiImg) {
//       return cmiImg.select(cmiBand)
//                   .addBands(cmiImg.select(cmiBand)
//                                   .gt(percentImg))
//                   // Toggle on the percent values to check
//                   // .addBands(percentImg);
//     });
//   }).flatten());
// };



