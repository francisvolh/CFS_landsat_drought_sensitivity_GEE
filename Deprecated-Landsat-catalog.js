/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Point([-115.2830078125, 46.092051416891]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// CO1/T1_SR (deprecated)
var col_depr = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR").filterBounds(geometry);
var img_depr = col_depr.first();


// CO2/T1_L2
var col = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2').filterBounds(geometry);
var img = col.first();

// Scaling
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true);
}
img = applyScaleFactors(img);

Map.addLayer(img_depr, null, 'C01/T1_SR');
Map.addLayer(img, null, 'C02/T1_L2');

