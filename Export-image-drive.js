/*
Export single image to drive
Alec L. Robitaille
*/

// Load modules
var export_img = require('users/robitalec/CFS:modules/export_img.js');
var vars = require('users/robitalec/CFS:modules/variables.js');



// Set variables
var region = vars.canada;
var scale = 5e4;
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
