/*
Number of observations
Alec L. Robitaille
*/

var vars = require('users/francisv/CFS:modules/variables.js');


var count_nobs = function(split_indices, sensitivity) {
  var count = split_indices
    .reduce(ee.Reducer.count());

  return sensitivity.addBands(count);
};
exports.count_nobs = count_nobs;

var mask_nobs = function(type, counts, antecedent_list, index_list) {
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return index_list.map(function(index) {
          var id = index + '_ante' + antecedent_period;
          var sensitivity_band = type + '_sens_' + id + '_p15_p85';
          var baseline_count_band = id + '_wi_p15_p85_base' + '_count';
          var drought_count_band = id + '_lte_p15_drought' + '_count';
          
          var mask_baseline = counts.select(baseline_count_band).gte(vars.min_baseline_nobs);
          var mask_drought = counts.select(drought_count_band).gte(vars.min_drought_nobs);
          
          var mask = mask_baseline.and(mask_drought);
          
          return ee.Image([counts.select(sensitivity_band)
                                 .updateMask(mask)]);
      });
  }));
};
exports.mask_nobs = mask_nobs;