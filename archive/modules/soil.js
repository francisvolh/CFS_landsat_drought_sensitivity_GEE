var peat_depth = function() {
  var peat_depth = ee.Image('users/robitalec/CFS/Hugelius_mean_potential_peat_depth_cm')
    .rename(['mean_potential_peat_depth_cm']);

  return peat_depth;
};
exports.peat_depth = peat_depth;