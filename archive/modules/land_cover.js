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
