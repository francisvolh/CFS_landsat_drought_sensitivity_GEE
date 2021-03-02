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


// Percentiles across years
exports.gtPercentiles = function(means, percentiles) {
  //ee.ImageCollection.fromImages(
  return percentiles.map(function(percent) {
    var base = means.reduce(ee.Reducer.percentile(percent));
    return means.map(function(img) {return img.subtract(base)});
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



