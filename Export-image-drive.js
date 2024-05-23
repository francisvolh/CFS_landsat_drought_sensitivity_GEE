/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-142.30946577233564, 73.72057482330297],
          [-142.30946577233564, 40.963680927935904],
          [-49.672747022335656, 40.963680927935904],
          [-49.672747022335656, 73.72057482330297]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export single image to drive
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Set variables
var region = ee.Geometry.Polygon(
  [[[-142.30946577233564, 73.72057482330297],
    [-142.30946577233564, 40.963680927935904],
    [-49.672747022335656, 40.963680927935904],
    [-49.672747022335656, 73.72057482330297]]]);
var scale = 1e4;
var col = ee.ImageCollection('users/robitalec/CFS/2024-03-09/2024-03-09_image_col');



// File name
var export_name = '2024-03-09_ND_sens_coarse';



// Map region
Map.addLayer(region);



// Export image to drive
Export.image.toDrive({
  image: col.mosaic(),
  description: export_name,
  folder: 'Exports',
  scale: scale,
  region: region
});
