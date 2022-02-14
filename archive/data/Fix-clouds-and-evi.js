
Map.addLayer(ee.Image('LANDSAT/LT5_L1T_32DAY_EVI/19840609'), null, 'evi composite')
// Map.addLayer(evi)
var l5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR")
              .filter(ee.Filter.bounds(geometry))

var visParams = {
  bands: ['B3', 'B2', 'B1'],
  min: 0,
  max: 0.3,
  gamma: 1.4,
};
// 1:0
// 2:1
// 3:1
// 4:0
// 5:1
// 6:0
// 7:1
var maskClouds = function(image) {
  var qa = image.select('pixel_qa');
  // If the cloud bit (5) is set and the cloud confidence (7) is high
  // or the cloud shadow bit is set (3), then it's a bad pixel.
  var cloud = qa.bitwiseAnd(1 << 5)
                .and(qa.bitwiseAnd(1 << 6))
                .or(qa.bitwiseAnd(1 << 3));

  // Remove edge pixels that don't occur in all bands
  var mask2 = image.mask().reduce(ee.Reducer.min());
  return image.updateMask(cloud.not()).updateMask(mask2);
};
var rescale = function(img) {
  return ee.Image([
    img.select('B1').multiply(0.0001),
    img.select('B2').multiply(0.0001),
    img.select('B3').multiply(0.0001),
    img.select('B4').multiply(0.0001),
    img.select('B5').multiply(0.1),
    img.select('B6').multiply(0.0001),
    img.select('B7').multiply(0.0001),
    img.select('sr_atmos_opacity').multiply(0.001),
    img.select('sr_cloud_qa'),
    img.select('pixel_qa'),
    img.select('radsat_qa')
  ]);
};
var diyevi = l5.filterDate('1984-06-01', '1984-07-01')
               .map(rescale)
               .map(function(img) {
   return img.addBands(
    img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
    // img.expression('2.5 * (((nir * 0.0001) - (red * 0.0001)) / ((nir * 0.0001) + 6 * (red * 0.0001) - 7.5 * (blue * 0.0001) + 1))',
                         {blue: img.select('B1'),
                          red: img.select('B3'),
                          nir: img.select('B4')
                         }).rename('evi'))
 })
var woclouds = diyevi.map(maskClouds).first()
diyevi = diyevi.first()
Map.addLayer(woclouds, visParams, 'w/o clouds')
Map.addLayer(diyevi, visParams, 'l5')
Map.addLayer(woclouds.select('evi'), null, 'diy evi')
