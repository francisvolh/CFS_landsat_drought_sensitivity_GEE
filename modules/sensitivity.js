/*
Drought sensitivity
Alec L. Robitaille

Relative
S {P,T,L} = [ (baseline EVI{P} – drought EVI{P,T,L}) / baseline EVI{P} ] x 100

Absolute
S {P,T,L} = baseline EVI{P} – drought EVI{P,T,L}
*/

var sensitivity_absolute_cap = function(split_indices, antecedent_list, index_list) {
	var means = split_indices.mean();
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return index_list.map(function(index) {
          var id = index + '_ante' + antecedent_period;
          var baseline_band = id + '_wi_p15_p85_base';
          var drought_band = id + '_lte_p15_drought';
          var sensitivity_band = 'Abs_sens_' + id + '_p15_p85';

          return means.expression('baseline - drought', {
            baseline: means.select(baseline_band),
            drought: means.select(drought_band)
          }).rename(sensitivity_band);
      });
    })
  );
};
exports.sensitivity_absolute_cap = sensitivity_absolute_cap;

var sensitivity_relative_cap = function(split_indices, antecedent_list, index_list) {
	var means = split_indices.median();
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return index_list.map(function(index) {
          var id = index + '_ante' + antecedent_period;
          var baseline_band = id + '_wi_p15_p85_base';
          var drought_band = id + '_lte_p15_drought';
          var sensitivity_band = 'Rel_sens_' + id + '_p15_p85';

          return means.expression('((baseline - drought) / baseline) * 100', {
            baseline: means.select(baseline_band),
            drought: means.select(drought_band)
          }).rename(sensitivity_band);
        });
    })
  );
};
exports.sensitivity_relative_cap = sensitivity_relative_cap;



// ARCHIVE --------------------------------------------------------------------
var zzz_sensitivity_absolute = function(split_indices, antecedent_list, percentile_list, index_list) {
	var means = split_indices.mean();
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return percentile_list.map(function(percentile) {
        return index_list.map(function(index) {
          var id = index + '_ante' + antecedent_period + '_p' + percentile;
          var baseline_band = id + '_base';
          var drought_band = id + '_drought';
          var sensitivity_band = 'Abs_sens_' + id;

          return means.expression('baseline - drought', {
            baseline: means.select(baseline_band),
            drought: means.select(drought_band)
          }).rename(sensitivity_band);
        });
      });
    })
  );
};
exports.zzz_sensitivity_absolute = zzz_sensitivity_absolute;

var zzz_sensitivity_relative = function(split_indices, antecedent_list, percentile_list, index_list) {
	var means = split_indices.mean();
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return percentile_list.map(function(percentile) {
        return index_list.map(function(index) {
          var id = index + '_ante' + antecedent_period + '_p' + percentile;
          var baseline_band = id + '_base';
          var drought_band = id + '_drought';
          var sensitivity_band = 'Rel_sens_' + id;

          return means.expression('((baseline - drought) / baseline) * 100', {
            baseline: means.select(baseline_band),
            drought: means.select(drought_band)
          }).rename(sensitivity_band);
        });
      });
    })
  );
};
exports.zzz_sensitivity_relative = zzz_sensitivity_relative;
