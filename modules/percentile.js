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
	    percentile_images.select('CMI_ante3mo.*').gte(img.select('CMI_ante3mo_mean')),
	    // percentile_images.select('CMI_ante6mo.*').gte(img.select('CMI_ante6mo_mean')),
      percentile_images.select('CMI_ante12mo.*').gte(img.select('CMI_ante12mo_mean')),
      percentile_images.select('CMI_ante5yr.*').gte(img.select('CMI_ante5yr_mean_min'))
      ]).copyProperties(img);
	});
	var out = ee.ImageCollection(images_lt_percentiles);
  var new_names = out.bandNames();
  new_names = new_names.replaceAll('_mean', '_lt').replaceAll('_min', '');
  out = out.rename(new_names);
  return out;
};
exports.lt_percentile = lt_percentile;

// TODO: find a fix to insert "lt_"
