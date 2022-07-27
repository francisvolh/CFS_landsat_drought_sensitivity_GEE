/*
Number of observations
Alec L. Robitaille
*/

var count_nobs = function(split_indices, sensitivity) {
  var count = split_indices
    .reduce(ee.Reducer.count());

  return sensitivity.addBands(count);
};
exports.count_nobs = count_nobs;

var mask_nobs = function(sensitivity, antecedent_list, index_list) {
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return index_list.map(function(index) {
          var id = index + '_ante' + antecedent_period;
          var baseline_band = id + '_wi_p15_p85_base';
          var drought_band = id + '_lte_p15_drought';
          var sensitivity_band = 'Abs_sens_' + id + '_p15_p85';
          var baseline_count_band = baseline_band + '_count';
          var drought_count_band = drought_band + '_count';
          
          var mask_baseline = sensitivity.select(baseline_count_band).gte(21);
          var mask_drought = sensitivity.select(drought_count_band).gte(3);
          
          return ee.Image([sensitivity.select(baseline_band)
                                      .updateMask(mask_baseline),
                           sensitivity.select(drought_band)
                                      .updateMask(mask_drought)]);
      });
  }));
};
exports.mask_nobs = mask_nobs;