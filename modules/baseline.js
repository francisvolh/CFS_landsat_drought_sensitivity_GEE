// Calculate baselines
exports.gtPercentile = function(img, cmiBand, percentileBand) {
  var outname = cmiBand + '-gt-' + percentileBand;

  return img.addBands(
    img.expression(
    'cmi > percentile', {
      'cmi': img.select(cmiBand),
      'percentile': img.select(percentileBand)
    }).rename(outname));
};


exports.antecedentPercentile = function(years, images, band, percentiles) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    var ante12max = ee.Date.fromYMD(yr, antemax, 1);
    
    var band3 = band + '_ante3';
    var band6 = band + '_ante6';
    var band12 = band + '_ante12';
    
    return ee.Image([
      // Antecedent: 3
      images.filter(ee.Filter.eq('year', yr))
              .filter(ee.Filter.rangeContains('month', ante3min, antemax))
              .select([band], [band3])
              .reduce(ee.Reducer.percentile(percentiles)),
               
      // Antecedent: 6
      images.filter(ee.Filter.eq('year', yr))
              .filter(ee.Filter.rangeContains('month', ante6min, antemax))
              .select([band], [band6])
              .reduce(ee.Reducer.percentile(percentiles)),
               
      // Antecedent: 12
      images.filter(ee.Filter.date(ante12max.advance(-1, 'year'),
                                      ante12max))
              .select([band], [band12])
              .reduce(ee.Reducer.percentile(percentiles))
      ]).set('year', yr);
  }));
};