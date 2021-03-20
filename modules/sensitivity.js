// Mask vegetation using fire and land cover, then split into drought/non-drought pixels
exports.maskVeg = function(veg, droughts, fires, lc, percentiles) {
  // Map across images
  return veg.map(function(v) {
    // Get year
    var yr = v.date().get('year');
    
    // Filter drought masks matching year
    var base = droughts.filter(ee.Filter.eq('year', yr))
                       .first();
                       
    // Filter fire masks matching year (selecting where there was no fire in last 5 years)
    var fire = fires.filter(ee.Filter.eq('year', yr))
                    .first()
                    .eq(0);

    // Select NDVI and EVI from MODIS
    var vegbands = ['NDVI', 'EVI'];

    // Mask fire and land cover, rescale NDVI and EVI
    v = v.updateMask(fire)
         .updateMask(lc)
         .select(vegbands)
         .multiply(0.0001);
                    
    return ee.Image(
      // Loop over percentiles
      percentiles.map(function(percent) {
        // Select drought masks for percent
        // These are CMI greater than, therefore 0: drought, 1:non drought
        var ante3band = 'CMI_gt_ante3_p' + percent;
        var ante6band = 'CMI_gt_ante6_p' + percent;
        var ante12band = 'CMI_gt_ante12_p' + percent;
        
        // Baseline regions for each antecedent period
        // Flipping mask to 1: drought, 0: non drought
        var drought3 = base.select(ante3band).eq(0);
        var drought6 = base.select(ante6band).eq(0);
        var drought12 = base.select(ante12band).eq(0);

        // Output NDVI and EVI band names
        var ante3ndvi = 'NDVI_ante3_p' + percent;
        var ante6ndvi = 'NDVI_ante6_p' + percent;
        var ante12ndvi = 'NDVI_ante12_p' + percent;
        var ante3evi = 'EVI_ante3_p' + percent;
        var ante6evi = 'EVI_ante6_p' + percent;
        var ante12evi = 'EVI_ante12_p' + percent;
        
        // Antecedent drought NDVI measures
        var veg3 = v.updateMask(drought3)
                    .rename([ante3ndvi, ante3evi]);
        var veg6 = v.updateMask(drought6)
                    .rename([ante6ndvi, ante6evi]);
        var veg12 = v.updateMask(drought12)
                     .rename([ante12ndvi, ante12evi]);
        
        // Combine antecedent drought masks, to generate baseline mask
        //  where all three periods are non-drought (1+1+1 = 3 non drought)
        var basemask = base.expression('ante3 + ante6 + ante12', {
          'ante3': base.select(ante3band),
          'ante6': base.select(ante6band),
          'ante12': base.select(ante12band)
        }).eq(3);
        
        // Output baseline bands for each percent
        var ndviband = 'NDVI_base_p' + percent;
        var eviband = 'EVI_base_p' + percent;
        
        // Update vegetation with baseline mask
        var baseveg = v.updateMask(basemask)
                       .rename([ndviband, eviband]);
        
        // Return baseline and drought period NDVI/EVI measures
        return ee.Image([baseveg, veg3, veg6, veg12]).copyProperties(v);
      })
    );
  });
};


// Calculate drought sensitivity
exports.droughtSensitivity = function(vegmeans, percentiles) {
  // Map over percentiles
  return ee.Image(percentiles.map(function(percent) {
    // Set up input and output band names, combining with percentile
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
    
    // Calculate drought sensitivity (
    // (baseline - drought) / baseline) * 100
    // for each antecedent period and NDVI+EVI
    return ee.Image([vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNDVI),
                                          drought: vegmeans.select(ante3NDVI)
                                        }).rename(sens3NDVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNDVI),
                                          drought: vegmeans.select(ante6NDVI)
                                        }).rename(sens6NDVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNDVI),
                                          drought: vegmeans.select(ante12NDVI)
                                        }).rename(sens12NDVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseEVI),
                                          drought: vegmeans.select(ante3EVI)
                                        }).rename(sens3EVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseEVI),
                                          drought: vegmeans.select(ante6EVI)
                                        }).rename(sens6EVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseEVI),
                                          drought: vegmeans.select(ante12EVI)
                                        }).rename(sens12EVI)]);
  }));
};


// Calculate drought sensitivity prime
// Maximum of three antecedent periods
exports.droughtSensivitityPrime = function(sens, percentiles) {
  // Map over percentiles
  return ee.Image(percentiles.map(function(percent) {
    // Setup input and output band names
    var sens3NDVI = 'Sensitivity_NDVI_ante3_p' + percent;
    var sens6NDVI = 'Sensitivity_NDVI_ante6_p' + percent;
    var sens12NDVI = 'Sensitivity_NDVI_ante12_p' + percent;
    
    var sens3EVI = 'Sensitivity_EVI_ante3_p' + percent;
    var sens6EVI = 'Sensitivity_EVI_ante6_p' + percent;
    var sens12EVI = 'Sensitivity_EVI_ante12_p' + percent;
    
    var sensPrimeNDVI = 'Sens_Prime_NDVI_p' + percent;
    var sensPrimeEVI = 'Sens_Prime_EVI_p' + percent;
    
    // For EVI and NDVI
    // Select antecedent 3, 6, 12 and return the max 
    return ee.Image([
      sens.select(sens3NDVI)
          .max(sens.select(sens6NDVI))
          .max(sens.select(sens12NDVI))
          .rename(sensPrimeNDVI),
      sens.select(sens3EVI)
          .max(sens.select(sens6EVI))
          .max(sens.select(sens12EVI))
          .rename(sensPrimeEVI)
      ]);
  }));
};

