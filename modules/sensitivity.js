// Split vegetation indices into drought/non-drought pixels
exports.splitDrought = function(veg, drought, antes, percentiles, indices) {
  // Map across images
  return veg.map(function(v) {
    // Get year
    var yr = v.date().get('year');

    // Filter drought masks matching year
    var base = drought.filter(ee.Filter.eq('year', yr))
                      .first();

    return antes.map(function(ante) {
        // Loop over percentiles
        return percentiles.map(function(p) {
          // Loop over indices
          return indices.map(function(index) {
            // Set up band names
            var droughtmaskband = 'CMI_lt_ante' + ante + 'mo_p' + p;
            var antepindexband = index + '_ante' + ante + 'mo_p' + p;
            var baseband = index + '_base_p' + p;

            // Set up drought and base mask
            var droughtmask = base.select(droughtmaskband);
            var basemask = base.select(droughtmaskband).eq(0);

            // Baseline vegetation index
            var baseveg = v.select(index)
                           .updateMask(basemask)
                           .rename([baseband]);

            // Drought vegetation index
            var droughtveg = v.select(index)
                              .updateMask(droughtmask)
                              .rename([antepindexband]);
            return basemask
            // return [baseveg, droughtveg]//ee.Image(
               //.copyProperties(v);
          });
        });
      })
    // ]);
  });
};



// Calculate drought sensitivity
exports.droughtSensitivity = function(vegmeans, percentiles) {
  // Map over percentiles
  return ee.Image(percentiles.map(function(percent) {
    // Set up input and output band names, combining with percentile
    var baseNDVI = 'NDVI_base_p' + percent + '_mean';
    var baseEVI = 'EVI_base_p' + percent + '_mean';
    var baseNBR = 'NBR_base_p' + percent + '_mean';

    var ante3NDVI = 'NDVI_ante3mo_p' + percent + '_mean';
    var ante6NDVI = 'NDVI_ante6mo_p' + percent + '_mean';
    var ante12NDVI = 'NDVI_ante12mo_p' + percent + '_mean';
    var ante5NDVI = 'NDVI_ante5yr_p' + percent + '_mean';
    var ante3EVI = 'EVI_ante3mo_p' + percent + '_mean';
    var ante6EVI = 'EVI_ante6mo_p' + percent + '_mean';
    var ante12EVI = 'EVI_ante12mo_p' + percent + '_mean';
    var ante5EVI = 'EVI_ante5yr_p' + percent + '_mean';
    var ante3NBR = 'NBR_ante3mo_p' + percent + '_mean';
    var ante6NBR = 'NBR_ante6mo_p' + percent + '_mean';
    var ante12NBR = 'NBR_ante12mo_p' + percent + '_mean';
    var ante5NBR = 'NBR_ante5yr_p' + percent + '_mean';

    var sens3NDVI = 'Sens_NDVI_ante3mo_p' + percent;
    var sens6NDVI = 'Sens_NDVI_ante6mo_p' + percent;
    var sens12NDVI = 'Sens_NDVI_ante12mo_p' + percent;
    var sens5NDVI = 'Sens_NDVI_ante5yr_p' + percent;
    var sens3EVI = 'Sens_EVI_ante3mo_p' + percent;
    var sens6EVI = 'Sens_EVI_ante6mo_p' + percent;
    var sens12EVI = 'Sens_EVI_ante12mo_p' + percent;
    var sens5EVI = 'Sens_EVI_ante5yr_p' + percent;
    var sens3NBR = 'Sens_NBR_ante3mo_p' + percent;
    var sens6NBR = 'Sens_NBR_ante6mo_p' + percent;
    var sens12NBR = 'Sens_NBR_ante12mo_p' + percent;
    var sens5NBR = 'Sens_NBR_ante5yr_p' + percent;

    // Calculate drought sensitivity (
    // (baseline - drought) / baseline) * 100
    // for each antecedent period and NDVI+EVI
    return ee.Image([// NDVI
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
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
                                          baseline: vegmeans.select(baseNDVI),
                                          drought: vegmeans.select(ante5NDVI)
                                        }).rename(sens5NDVI),
                    // EVI
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
                                        }).rename(sens12EVI),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseEVI),
                                          drought: vegmeans.select(ante5EVI)
                                        }).rename(sens5EVI),
                    // NBR
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNBR),
                                          drought: vegmeans.select(ante3NBR)
                                        }).rename(sens3NBR),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNBR),
                                          drought: vegmeans.select(ante6NBR)
                                        }).rename(sens6NBR),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNBR),
                                          drought: vegmeans.select(ante12NBR)
                                        }).rename(sens12NBR),
                    vegmeans.expression('((baseline - drought) / baseline) * 100', {
                                          baseline: vegmeans.select(baseNBR),
                                          drought: vegmeans.select(ante5NBR)
                                        }).rename(sens5NBR)]);
  }));
};


// Calculate drought sensitivity prime
// Maximum of three antecedent periods
exports.droughtSensivitityPrime = function(sens, percentiles) {
  // Map over percentiles
  return ee.Image(percentiles.map(function(percent) {
    // Setup input and output band names
    var sens3NDVI = 'Sens_NDVI_ante3mo_p' + percent;
    var sens6NDVI = 'Sens_NDVI_ante6mo_p' + percent;
    var sens12NDVI = 'Sens_NDVI_ante12mo_p' + percent;
    var sens5NDVI = 'Sens_NDVI_ante5yr_p' + percent;

    var sens3EVI = 'Sens_EVI_ante3mo_p' + percent;
    var sens6EVI = 'Sens_EVI_ante6mo_p' + percent;
    var sens12EVI = 'Sens_EVI_ante12mo_p' + percent;
    var sens5EVI = 'Sens_EVI_ante5yr_p' + percent;

    var sens3NBR = 'Sens_NBR_ante3mo_p' + percent;
    var sens6NBR = 'Sens_NBR_ante6mo_p' + percent;
    var sens12NBR = 'Sens_NBR_ante12mo_p' + percent;
    var sens5NBR = 'Sens_NBR_ante5yr_p' + percent;

    var sensPrimeNDVI = 'Sens_Prime_NDVI_p' + percent;
    var sensPrimeEVI = 'Sens_Prime_EVI_p' + percent;
    var sensPrimeNBR = 'Sens_Prime_NBR_p' + percent;

    // For EVI and NDVI
    // Select antecedent 3, 6, 12 and return the max
    return ee.Image([
      sens.select(sens3NDVI)
          .max(sens.select(sens6NDVI))
          .max(sens.select(sens12NDVI))
          // .max(sens.select(sens5NDVI))
          .rename(sensPrimeNDVI),
      sens.select(sens3EVI)
          .max(sens.select(sens6EVI))
          .max(sens.select(sens12EVI))
          // .max(sens.select(sens5EVI))
          .rename(sensPrimeEVI),
      sens.select(sens3NBR)
          .max(sens.select(sens6NBR))
          .max(sens.select(sens12NBR))
          // .max(sens.select(sens5NBR))
          .rename(sensPrimeNBR)
      ]);
  }));
};

