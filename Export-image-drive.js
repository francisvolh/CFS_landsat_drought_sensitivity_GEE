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
var export_name_3mo = '2024-03-09_ND_NDVI_3mo_coarse';
var export_name_12mo = '2024-03-09_ND_NDVI_12mo_coarse';
var export_name_3yr = '2024-03-09_ND_NDVI_3yr_coarse';



// Map region
Map.addLayer(region);



// Export images to drive
Export.image.toDrive({
  image: col.select('.*3mo.*').mosaic(),
  description: export_name_3mo,
  folder: 'Exports',
  scale: scale,
  region: region
});

Export.image.toDrive({
  image: col.select('.*12mo.*').mosaic(),
  description: export_name_12mo,
  folder: 'Exports',
  scale: scale,
  region: region
});

Export.image.toDrive({
  image: col.select('.*3yr.*').mosaic(),
  description: export_name_3yr,
  folder: 'Exports',
  scale: scale,
  region: region
});
