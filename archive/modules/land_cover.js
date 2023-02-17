// Land cover transitions forest types <-> shrub types
var lc_transitions = function() {
    var lc_remapped = hermosilla_1984_2019
      .map(utils.set_year)
      .map(mask_classes)
      .map(function(img) {
        return img.remap([40, 50, 
                          80, 81,
                          100, 210, 220, 230],
                          [1, 1, 
                           2, 2, 
                           3, 3, 3, 3],
                           0,
                           'land_cover');
      });
  var lc_transitions = lc_remapped.reduce(ee.Reducer.countDistinct()).eq(1);
  
  return lc_transitions;
};
exports.lc_transitions = lc_transitions;



var zzz_mask_land_cover_and_fire = function(img) {
  var img_year = img.date().get('year');
  return img.updateMask(
		lc_and_fire.filter(ee.Filter.eq('year', img_year))
               .first()
               .mask());
};
exports.zzz_mask_land_cover_and_fire = zzz_mask_land_cover_and_fire;



// Mask heterogeneous
var n_pixels = 1.5;
var mask_heterogeneous = function(img) {
  var foc_mean = img.focalMean(n_pixels, 'square', 'pixels');
  return img.mask(img.eq(foc_mean));
};
exports.mask_heterogeneous = mask_heterogeneous;



// Get homogeneous land cover collection
var homogeneous_land_cover = function() {
	return hermosilla_1984_2019_plus_2020
    .map(utils.set_year)
    .map(mask_heterogeneous)
    .map(mask_classes);
};
exports.homogeneous_land_cover = homogeneous_land_cover;



// Get focal mean band
var lc_focal_mean = function() {
  return hermosilla_1984_2019_plus_2020
    .reduce(ee.Reducer.mode())
    .focalMean(n_pixels, 'square', 'pixels')
    .updateMask(lc_and_fire.reduce(ee.Reducer.mode()).mask());
};
exports.lc_focal_mean = lc_focal_mean;



// Get land cover count mask
var lc_count_mask = function() {
  var lc_masked = hermosilla_1984_2019
    .map(utils.set_year)
    .map(mask_classes);
  return lc_masked.reduce(ee.Reducer.count()).eq(lc_masked.size());
};
exports.lc_count_mask = lc_count_mask;
