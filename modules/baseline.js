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

exports.gtPercentileBands = function(cmiImages, cmiBand, percentileImages) {
  return ee.ImageCollection(percentileImages.map(function(percentImg) {
      var bands = percentImg.bandNames();
      var yr = percentImg.get('year');
      
      return ee.Image.cat(bands.map(function(band) {
        var outname = 'gt-' + band;
        var filtImgs = cmiImages.filter(ee.Filter.eq('year', yr))
                                .select(cmiBand);
        
        return ee.Image.cat(filtImgs.map(function(cmiImg) {
          return ee.Image(cmiImg.addBands(
            cmiImg.expression(
              'cmi > percentile', {
                'cmi': cmiImg.select(cmiBand),
                'percentile': percentImg.select([band])
                }).rename(outname))).aside(print);
        }))
      }))
    })
  );
};

exports.gtPercentileBands2 = function(years, cmiImages, cmiBand, percentileImages) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    var filtCMI = cmiImages.filter(ee.Filter.eq('year', yr));
    var filterPerc = ee.Image(percentileImages.filter(ee.Filter.eq('year', yr)).first());
    return filtCMI.map(function(cmiImg) {
      return ee.Image.cat(cmiImg.select(cmiBand),
                          cmiImg.select(cmiBand).gt(filterPerc))}).toBands();
  }));
};


exports.gtPercentileBands3 = function(percentileImages, cmiImages, cmiBand) {
  return ee.ImageCollection.fromImages(percentileImages.map(function(percentImg) {
    var yr = percentImg.get('year')
    
    var filtCMI = cmiImages.filter(ee.Filter.eq('year', yr));

    return filtCMI.map(function(cmiImg) {
      return ee.Image.cat([cmiImg.select(cmiBand),
                           cmiImg.select(cmiBand)
                                 .gt(percentImg)])
    })
  }));
};


  // return ee.ImageCollection(percentileImages.map(function(percentImg) {
  //     var bands = percentImg.bandNames();
  //     var yr = percentImg.get('year');
      
  //     return ee.Image.cat(bands.map(function(band) {
  //       var outname = 'gt-' + band;
  //       var filtImgs = cmiImages.filter(ee.Filter.eq('year', yr))
  //                               .select(cmiBand);
        
  //       return ee.Image.cat(filtImgs.map(function(cmiImg) {
  //         return ee.Image(cmiImg.addBands(
  //           cmiImg.expression(
  //             'cmi > percentile', {
  //               'cmi': cmiImg.select(cmiBand),
  //               'percentile': percentImg.select([band])
  //               }).rename(outname))).aside(print);
  //       }))
  //     }))
  //   })
  // );


exports.antecedentPercentile = function(years, images, band, percentiles) {
  return ee.ImageCollection.fromImages(years.map(function(yr) {
    // antemax - July 1
    var ante12max = ee.Date.fromYMD(yr, 6, 1);

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
