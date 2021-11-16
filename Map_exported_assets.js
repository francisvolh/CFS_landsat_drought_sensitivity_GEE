/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var image = ee.Image("users/robitalec/CFS/drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-West"),
    image2 = ee.Image("users/robitalec/CFS/drought-sensitivity-Landsat-1985_2012-NDVI-12mo-p15-Alberta");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// Gena's palette functions
var palettes = require('users/gena/packages:palettes');

var pal = palettes.colorbrewer.RdBu[9];
var min = -0.1; var max = 0.1;
var viz = {min: min, max: max, palette: pal};

function showPalette(name, palette) {
  var image = ee.Image.pixelLonLat().select(0)
    .clip(ee.Geometry.Rectangle({ coords: [[0, 0], [100, 10]], geodesic: false }))
    .visualize({ min: 0, max: 100, palette: palette });

  print(name);
  print(ui.Thumbnail(image));
}
showPalette(min + '           0           ' + max, palettes.colorbrewer.RdBu[5]);


Map.addLayer(ee.Image.constant(1), {opacity:0.5})
Map.addLayer(image, viz)