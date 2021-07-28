// var water = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24").select('water_mask');
var water = ee.Image("JRC/GSW1_3/GlobalSurfaceWater")
                    .select('occurrence')
                    .gt(0.7)
                    .unmask()
                    .not();
                    
exports.maskWater = function(img) {
  return img.updateMask(water);
}; 