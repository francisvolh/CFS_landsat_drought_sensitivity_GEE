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
var wi_percentile = function(ante_images, percentile_images) {
	var ante_wi_percentile = ante_images.map(function(ante_img) {
    var out = ee.Image([
      ee.Image.constant(0).where(ante_img.select('CMI_ante3mo_mean').gte(percentile_images.select('CMI_ante3mo_mean_p15')).and(
                                 ante_img.select('CMI_ante3mo_mean').lte(percentile_images.select('CMI_ante3mo_mean_p85'))),
                                 1)
                          .rename('CMI_ante3mo_lt_p15_gt_p85'),
      ee.Image.constant(0).where(ante_img.select('CMI_ante12mo_mean').gte(percentile_images.select('CMI_ante12mo_mean_p15')).and(
                                 ante_img.select('CMI_ante12mo_mean').lte(percentile_images.select('CMI_ante12mo_mean_p85'))),
                                 1)
                           .rename('CMI_ante12mo_lt_p15_gt_p85'),
      ee.Image.constant(0).where(ante_img.select('CMI_ante5yr_mean').gte(percentile_images.select('CMI_ante5yr_mean_p15')).and(
                                 ante_img.select('CMI_ante5yr_mean').lte(percentile_images.select('CMI_ante5yr_mean_p85'))),
                                 1)
                           .rename('CMI_ante5yr_lt_p15_gt_p85')
       ]).copyProperties(img);
    return out;
	});
	return ante_wi_percentile;
};
exports.wi_percentile = wi_percentile;





// ARCHIVE --------------------------------------------------------------------
// Compare percentile images for each antecedent period to each image's antecedent means
var zzz_lt_percentile = function(images, percentile_images) {
	var images_lt_percentiles = images.map(function(img) {
    var out = ee.Image([
      percentile_images.select('CMI_ante3mo.*').gte(img.select('CMI_ante3mo_mean')),
      // percentile_images.select('CMI_ante6mo.*').gte(img.select('CMI_ante6mo_mean')),
      percentile_images.select('CMI_ante12mo.*').gte(img.select('CMI_ante12mo_mean')),
      percentile_images.select('CMI_ante5yr.*').gte(img.select('CMI_ante5yr_mean_min'))
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



// var lt_percentile_cap = function(images, percentile_images) {
// 	var images_lt_percentiles = images.map(function(img) {
//     var out = ee.Image([
//       percentile_images.select('CMI_ante3mo.*').gte(img.select('CMI_ante3mo_mean')).updateMask(
//         img.select('CMI_ante3mo_mean').gt(percentile_images.select('CMI_ante3mo_mean_p85'))),
//       percentile_images.select('CMI_ante12mo.*').gte(img.select('CMI_ante12mo_mean')).updateMask(
//         img.select('CMI_ante12mo_mean').gt(percentile_images.select('CMI_ante12mo_mean_p85'))),
//       percentile_images.select('CMI_ante5yr.*').gte(img.select('CMI_ante5yr_mean_min')).updateMask(
//         img.select('CMI_ante5yr_mean_min').gt(percentile_images.select('CMI_ante5yr_mean_min_p85')))
//       ]).copyProperties(img);
//     var new_names = ee.Image(out).bandNames();
//     new_names = new_names.map(function(nm) {
//       return ee.String(nm).replace('_min', '').replace('_mean', '_lt');
//     });
//     out = ee.Image(out).rename(new_names);
//     return out;
// 	});
// 	return images_lt_percentiles;
// };
// exports.lt_percentile_cap = lt_percentile_cap;
