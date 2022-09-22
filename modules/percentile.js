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
// Cap at 85th percentile
var get_percentile_masks = function(ante_images, percentile_images) {
	var percentile_masks = ante_images.map(function(ante_img) {
    var out = ee.Image([
      ante_img.select('CMI_ante3mo_mean').lte(percentile_images.select('CMI_ante3mo_mean_p15'))
        .rename('CMI_ante3mo_lte_p15'),
      ante_img.select('CMI_ante12mo_mean').lte(percentile_images.select('CMI_ante12mo_mean_p15'))
        .rename('CMI_ante12mo_lte_p15'),
      ante_img.select('CMI_ante3yr_mean').lte(percentile_images.select('CMI_ante3yr_mean_p15'))
        .rename('CMI_ante3yr_lte_p15'),

      ante_img.select('CMI_ante3mo_mean').gt(percentile_images.select('CMI_ante3mo_mean_p15'))
        .and(ante_img.select('CMI_ante3mo_mean').lt(percentile_images.select('CMI_ante3mo_mean_p85')))
        .rename('CMI_ante3mo_wi_p15_p85'),
      ante_img.select('CMI_ante12mo_mean').gt(percentile_images.select('CMI_ante12mo_mean_p15'))
        .and(ante_img.select('CMI_ante12mo_mean').lt(percentile_images.select('CMI_ante12mo_mean_p85')))
        .rename('CMI_ante12mo_wi_p15_p85'),
      ante_img.select('CMI_ante3yr_mean').gt(percentile_images.select('CMI_ante3yr_mean_p15'))
        .and(ante_img.select('CMI_ante3yr_mean').lt(percentile_images.select('CMI_ante3yr_mean_p85')))
        .rename('CMI_ante3yr_wi_p15_p85')
       ]).copyProperties(ante_img);
    return out;
	});
	return percentile_masks;
};
exports.get_percentile_masks = get_percentile_masks;





// ARCHIVE --------------------------------------------------------------------
// Compare percentile images for each antecedent period to each image's antecedent means
var zzz_lt_percentile = function(images, percentile_images) {
	var images_lt_percentiles = images.map(function(img) {
    var out = ee.Image([
      percentile_images.select('CMI_ante3mo.*').gt(img.select('CMI_ante3mo_mean')),
      // percentile_images.select('CMI_ante6mo.*').gt(img.select('CMI_ante6mo_mean')),
      percentile_images.select('CMI_ante12mo.*').gt(img.select('CMI_ante12mo_mean')),
      percentile_images.select('CMI_ante5yr.*').gt(img.select('CMI_ante5yr_mean_min'))
      ]).copyProperties(img);
    var new_names = ee.Image(out).bandNames();
    new_names = new_names.map(function(nm) {
      return ee.String(nm).replace('_min', '').replace('_mean', '_lt');
    });
    out = ee.Image(out).rename(new_names);
    return out;
	});
	return images_lt_percentiles;
};
exports.zzz_lt_percentile = zzz_lt_percentile;



// Compare percentile images for each antecedent period to each image's antecedent means
// Cap at 85th percentile
var zzz_lt_percentile_cap = function(images, percentile_images) {
	var images_lt_percentiles = images.map(function(img) {
    var out = ee.Image([
      percentile_images.select('CMI_ante3mo_mean_p15').gt(img.select('CMI_ante3mo_mean')),

      percentile_images.select('CMI_ante12mo_mean_p15').gt(img.select('CMI_ante12mo_mean')),

      percentile_images.select('CMI_ante5yr_mean_min_p15').gt(img.select('CMI_ante5yr_mean_min')),

      percentile_images.select('CMI_ante3mo_mean_p15').gt(img.select('CMI_ante3mo_mean')).where(
        img.select('CMI_ante3mo_mean').gt(percentile_images.select('CMI_ante3mo_mean_p85')), 0).rename('CMI_ante3mo_gt5'),

      percentile_images.select('CMI_ante12mo_mean_p15').gt(img.select('CMI_ante12mo_mean')).where(
        img.select('CMI_ante12mo_mean').gt(percentile_images.select('CMI_ante12mo_mean_p15')), 0).rename('CMI_ante12mo_lt_p15_gt_p85'),

      percentile_images.select('CMI_ante5yr_mean_min_p15').gt(img.select('CMI_ante5yr_mean_min')).where(
        img.select('CMI_ante5yr_mean_min').gt(percentile_images.select('CMI_ante5yr_mean_min_p15')), 0).rename('CMI_ante5yr_lt_p15_gt_p85')

      ]).copyProperties(img);
    var new_names = ee.Image(out).bandNames();
    new_names = new_names.map(function(nm) {
      return ee.String(nm).replace('_min', '').replace('_mean', '_lt');
    });
    out = ee.Image(out).rename(new_names);
    return out;
	});
	return images_lt_percentiles;
};
exports.zzz_lt_percentile_cap = zzz_lt_percentile_cap;


