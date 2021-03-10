exports.maskVeg = function(veg, droughts, fires, lc, percentiles) {
  return veg.map(function(v) {
    var yr = v.date().get('year');
    
    var base = droughts.filter(ee.Filter.eq('year', yr))
                       .first();
    var fire = fires.filter(ee.Filter.eq('year', yr))
                    .first()
                    .eq(0);

    var vegbands = ['NDVI', 'EVI'];

    v = v.updateMask(fire)
         .updateMask(lc)
         .select(vegbands)
         .multiply(0.0001);
                    
    return ee.Image(
      percentiles.map(function(percent) {
        var ante3band = 'CMI_gt_ante3_p' + percent;
        var ante6band = 'CMI_gt_ante6_p' + percent;
        var ante12band = 'CMI_gt_ante12_p' + percent;
        
        var drought3 = base.select(ante3band).eq(0);
        var drought6 = base.select(ante6band).eq(0);
        var drought12 = base.select(ante12band).eq(0);

        var ante3ndvi = 'NDVI_ante3_p' + percent;
        var ante6ndvi = 'NDVI_ante6_p' + percent;
        var ante12ndvi = 'NDVI_ante12_p' + percent;
        var ante3evi = 'EVI_ante3_p' + percent;
        var ante6evi = 'EVI_ante6_p' + percent;
        var ante12evi = 'EVI_ante12_p' + percent;
        
        
        var veg3 = v.updateMask(drought3)
                    .rename([ante3ndvi, ante3evi]);
        var veg6 = v.updateMask(drought6)
                    .rename([ante6ndvi, ante6evi]);
        var veg12 = v.updateMask(drought12)
                     .rename([ante12ndvi, ante12evi]);
        
        var basemask = base.expression('ante3 + ante6 + ante12', {
          'ante3': base.select(ante3band),
          'ante6': base.select(ante6band),
          'ante12': base.select(ante12band)
        }).eq(3);
        
        var ndviband = 'NDVI_base_p' + percent;
        var eviband = 'EVI_base_p' + percent;
        
        var baseveg = v.updateMask(basemask)
                       .rename([ndviband, eviband]);
        
        return ee.Image([baseveg, veg3, veg6, veg12]).copyProperties(v);
      })
    );
  });
};

exports.maskCount = function(veg) {
  var counts = veg.reduce(ee.Reducer.count())
                  .gte(3);
  return veg.map(function(img) {
    return img.updateMask(counts);
  });
};


exports.droughtSensitivity = function(vegmeans, percentiles) {
  return ee.Image(percentiles.map(function(percent) {
    var baseNDVI = 'NDVI_base_p' + percent + '_mean';
    var baseEVI = 'EVI_base_p' + percent + '_mean';
    
    var ante3NDVI = 'NDVI_ante3_p' + percent + '_mean';
    var ante6NDVI = 'NDVI_ante6_p' + percent + '_mean';
    var ante12NDVI = 'NDVI_ante12_p' + percent + '_mean';
    var ante3EVI = 'EVI_ante3_p' + percent + '_mean';
    var ante6EVI = 'EVI_ante6_p' + percent + '_mean';
    var ante12EVI = 'EVI_ante12_p' + percent + '_mean';
    
    var sens3NDVI = 'Sensitivity_NDVI_ante3_p' + percent;
    var sens6NDVI = 'Sensitivity_NDVI_ante6_p' + percent;
    var sens12NDVI = 'Sensitivity_NDVI_ante12_p' + percent;
    var sens3EVI = 'Sensitivity_EVI_ante3_p' + percent;
    var sens6EVI = 'Sensitivity_EVI_ante6_p' + percent;
    var sens12EVI = 'Sensitivity_EVI_ante12_p' + percent;
    
    return ee.Image([vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: baseNDVI,
                                          drought: ante3NDVI
                                        }).rename(sens3NDVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: baseNDVI,
                                          drought: ante6NDVI
                                        }).rename(sens6NDVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: baseNDVI,
                                          drought: ante12NDVI
                                        }).rename(sens12NDVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: baseEVI,
                                          drought: ante3EVI
                                        }).rename(sens3EVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: baseEVI,
                                          drought: ante6EVI
                                        }).rename(sens6EVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: baseEVI,
                                          drought: ante12EVI
                                        }).rename(sens12EVI)]);
  }));
};

