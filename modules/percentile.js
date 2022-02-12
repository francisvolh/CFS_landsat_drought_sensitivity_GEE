/*
Percentiles
Alec L. Robitaille
*/

// Get percentile
var get_percentile = function(images, percentile_list) {
	return images.reduce(ee.Reducer.percentile(percentile_list));
};
exports.get_percentile = get_percentile;

// Compare percentile images for each antecedent period to each image's antecedent means
var lt_percentile = function(images, percentile_images) {
	var images_lt_percentiles = images.map(function(img) {
    return ee.Image([
      percentile_images.select('CMI_ante3mo.*').gte(img.select(['CMI_ante3mo_mean'], ['CMI_ante3mo_lt'])),
      // percentile_images.select('CMI_ante6mo.*').gte(img.select(['CMI_ante6mo_mean'], ['CMI_ante6mo_lt'])),
      percentile_images.select('CMI_ante12mo.*').gte(img.select(['CMI_ante12mo_mean'], ['CMI_ante12mo_lt'])),
      percentile_images.select('CMI_ante5yr.*').gte(img.select(['CMI_ante5yr_mean'], ['CMI_ante5yr_lt']))



/*      img.select('CMI_ante3mo_mean').lte(percentile_images.select('CMI_ante3mo.*')),
      // img.select('CMI_ante6mo_mean').lte(percentile_images.select('CMI_ante6mo.*')),
      img.select('CMI_ante12mo_mean').lte(percentile_images.select('CMI_ante12mo.*')),
      img.select('CMI_ante5yr_mean_min').lte(percentile_images.select('CMI_ante5yr.*'))*/
     ]).copyProperties(img);
	});
	return images_lt_percentiles;
};
exports.lt_percentile = lt_percentile;

// TODO: find a fix to insert "lt_"

/*

  var percentile_3mo = means.select(['CMI_ante3mo_mean'], ['CMI_ante3mo_lt'])
                            .reduce(ee.Reducer.percentile(percentile_list));

  // var percentile_6mo = means.select(['CMI_ante6mo_mean'], ['CMI_ante6mo_lt'])
  //                           .reduce(ee.Reducer.percentile(percentile_list));

  var percentile_12mo = means.select(['CMI_ante12mo_mean'], ['CMI_ante12mo_lt'])
                             .reduce(ee.Reducer.percentile(percentile_list));

  var percentile_5yr = means.select(['CMI_ante5yr_mean_min'], ['CMI_ante5yr_lt'])
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

	return means_lt_percentiles;*/
