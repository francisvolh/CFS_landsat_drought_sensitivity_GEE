/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var alberta = ee.Image("users/robitalec/CFS/drought-sensitivity-Landsat-1985_2012-Alberta"),
    west = ee.Image("users/robitalec/CFS/drought-sensitivity-Landsat-1985_2012-West");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

// Gena's palette functions
var palettes = require('users/gena/packages:palettes');

var pal = palettes.colorbrewer.RdBu[9];
var min = -0.2; var max = 0.2;
var viz = {bands: 'Sens_NDVI_ante12mo_p15', min: min, max: max, palette: pal};

function showPalette(name, palette) {
  var image = ee.Image.pixelLonLat().select(0)
    .clip(ee.Geometry.Rectangle({ coords: [[0, 0], [100, 10]], geodesic: false }))
    .visualize({ min: 0, max: 100, palette: palette });

  print(name);
  print(ui.Thumbnail(image));
}
showPalette(min + ' to ' + max, pal);


Map.addLayer(ee.Image.constant(1), {opacity:0.5})
Map.addLayer(alberta, viz, 'alberta', false)
Map.addLayer(west, viz, 'western canada')