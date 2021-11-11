// Split vegetation indices into drought/non-drought pixels
exports.splitDrought = function(veg, drought, antes, percentiles, indices) {
  // Map across images
  return veg.map(function(v) {
    // Get year
    var yr = v.date().get('year');

    // Filter drought masks matching year
    var base = drought.filter(ee.Filter.eq('year', yr))
                      .first();
    // Loop over antes
    return ee.Image(antes.map(function(ante) {
        // Loop over percentiles
        return percentiles.map(function(p) {
          // Loop over indices
          return indices.map(function(index) {
            // Set up band names
            var ltband = 'CMI_lt_ante' + ante + 'mo_p' + p;
            var id = index + '_ante' + ante + 'mo_p' + p;
            var droughtband = id + '_drought';
            var baseband = id + '_base';

            // Set up drought and base mask
            var droughtmask = base.select(ltband).eq(1);
            var basemask = base.select(ltband).eq(0);

            // Baseline vegetation index
            var baseveg = v.select([index])
                           .updateMask(basemask)
                           .rename([baseband]);

            // Drought vegetation index
            var droughtveg = v.select([index])
                              .updateMask(droughtmask)
                              .rename([droughtband]);
            return [baseveg, droughtveg];
          });
        });
      })
    );
  });
};



exports.droughtSensitivity = function(means, antes, percentiles, indices) {
  // Loop over antes
  return ee.Image(antes.map(function(ante) {
      // Loop over percentiles
      return percentiles.map(function(p) {
        // Loop over indices
        return indices.map(function(index) {
          // Set up band names
          var id = index + '_ante' + ante + 'mo_p' + p;
          var baseband = id + '_base' + '_mean';
          var droughtband = id + '_drought' + '_mean';
          var sensband = 'Sens_' + id;

          return means.expression('(baseline - drought)', {
          // return means.expression('((baseline - drought) / baseline) * 100', {
                                baseline: means.select(baseband),
                                drought: means.select(droughtband)
                                }).rename(sensband);
        });
      });
    })
  );
};

// Calculate drought sensitivity prime
// Maximum of three antecedent periods
exports.droughtSensivitityPrime = function(sens, percentiles) {
  // Map over percentiles
  return ee.Image(percentiles.map(function(percent) {
    // Setup input and output band names
    var sens3NDVI = 'Sens_NDVI_ante3mo_p' + percent;
    // var sens6NDVI = 'Sens_NDVI_ante6mo_p' + percent;
    var sens12NDVI = 'Sens_NDVI_ante12mo_p' + percent;
    var sens5NDVI = 'Sens_NDVI_ante5yr_p' + percent;

    var sens3EVI = 'Sens_EVI_ante3mo_p' + percent;
    // var sens6EVI = 'Sens_EVI_ante6mo_p' + percent;
    var sens12EVI = 'Sens_EVI_ante12mo_p' + percent;
    var sens5EVI = 'Sens_EVI_ante5yr_p' + percent;

    var sens3NBR = 'Sens_NBR_ante3mo_p' + percent;
    // var sens6NBR = 'Sens_NBR_ante6mo_p' + percent;
    var sens12NBR = 'Sens_NBR_ante12mo_p' + percent;
    var sens5NBR = 'Sens_NBR_ante5yr_p' + percent;

    var sensPrimeNDVI = 'Sens_Prime_NDVI_p' + percent;
    var sensPrimeEVI = 'Sens_Prime_EVI_p' + percent;
    var sensPrimeNBR = 'Sens_Prime_NBR_p' + percent;

    // For EVI and NDVI
    // Select antecedent 3, 6, 12 and return the max
    return ee.Image([
      sens.select(sens3NDVI)
          // .max(sens.select(sens6NDVI))
          .max(sens.select(sens12NDVI))
          .max(sens.select(sens5NDVI))
          .rename(sensPrimeNDVI),
      sens.select(sens3EVI)
          // .max(sens.select(sens6EVI))
          .max(sens.select(sens12EVI))
          .max(sens.select(sens5EVI))
          .rename(sensPrimeEVI),
      sens.select(sens3NBR)
          // .max(sens.select(sens6NBR))
          .max(sens.select(sens12NBR))
          .max(sens.select(sens5NBR))
          .rename(sensPrimeNBR)
      ]);
  }));
};

