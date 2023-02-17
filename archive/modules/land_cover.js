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