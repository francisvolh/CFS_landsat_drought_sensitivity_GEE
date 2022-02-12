/*
Percentiles
Alec L. Robitaille
*/

// Compare percentile images for each antecedent period to each image's antecedent means
var lt_percentile = function(means, percentile_list) {
  var percentile_3mo = means.select(['CMI_ante3mo_mean'], ['CMI_lt_ante3mo'])
                            .reduce(ee.Reducer.percentile(percentile_list));

  var percentile_6mo = means.select(['CMI_ante6mo_mean'], ['CMI_lt_ante6mo'])
                            .reduce(ee.Reducer.percentile(percentile_list));

  var percentile_12mo = means.select(['CMI_ante12mo_mean'], ['CMI_lt_ante12mo'])
                             .reduce(ee.Reducer.percentile(percentile_list));

  var percentile_5yr = means.select(['CMI_ante5yr_mean_min'], ['CMI_lt_ante5yr'])
                            .reduce(ee.Reducer.percentile(percentile_list));

	var means_lt_percentiles = means.map(function(img) {
		return ee.Image([

      img.select('CMI_ante3mo_mean')
         .lt(percentile_3mo),

      // img.select('CMI_ante6mo_mean')
      //   .lt(percentile_6mo),

      img.select('CMI_ante12mo_mean')
         .lt(percentile_12mo),

      img.select('CMI_ante5yr_mean_min')
        .lt(percentile_5yr)

      ]).copyProperties(img);
	});

	return means_lt_percentiles;
};
exports lt_percentile = lt_percentile;