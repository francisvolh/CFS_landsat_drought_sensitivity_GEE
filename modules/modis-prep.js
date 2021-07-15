// MODIS prep


exports.rescale = function(img) {
  return img.multiply(0.0001)
            .float()
            .copyProperties(img)
            .set('system:time_start', img.get('system:time_start'));
};
//float?


var water = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24").select('water_mask');
exports.maskWater = function(img) {
  return img.updateMask(water.not());
};