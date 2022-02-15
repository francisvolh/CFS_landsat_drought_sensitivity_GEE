/*
Drought sensitivity
Alec L. Robitaille

Relative
S {P,T,L} = [ (baseline EVI{P} – drought EVI{P,T,L}) / baseline EVI{P} ] x 100

Absolute
S {P,T,L} = baseline EVI{P} – drought EVI{P,T,L}
*/

var sensitivity_absolute = function(split_indices, antecedent_list, percentile_list, index_list) {
	var means = split_indices.reduce(ee.Reducer.mean());
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return percentile_list.map(function(p) {
        return indices.map(function(index) {
          var id = index + '_ante' + antecedent_period + '_p' + percentile;
          var baseline_band = id + '_base' + '_mean';
          var drought_band = id + '_drought' + '_mean';
          var sensitivity_band = 'Abs_sens_' + id;

          return means.expression('(baseline - drought)', {
            baseline: means.select(baseline_band),
            drought: means.select(drought_band)
          }).rename(sensitivity_band);
        });
      });
    })
  );
};
exports.sensitivity_absolute = sensitivity_absolute;

var sensitivity_relative = function(means, antecedent_list, percentile_list, indices) {
  return ee.Image(antecedent_list.map(function(antecedent_period) {
      return percentile_list.map(function(percentile) {
        return indices.map(function(index) {
          var id = index + '_ante' + antecedent_period + '_p' + percentile;
          var baseline_band = id + '_base' + '_mean';
          var drought_band = id + '_drought' + '_mean';
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
exports.sensitivity_relative = sensitivity_relative;
