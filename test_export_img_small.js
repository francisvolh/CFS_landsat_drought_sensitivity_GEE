var main = require('users/francisv/CFS:modules/main.js');

var region = ee.Geometry.Rectangle([-142, 41, -49, 74]); // rough Canada bbox
var out = main.main_greenest('relative sensitivity', region);

Export.image.toDrive({
  image: out,
  description: 'canada_relative_sensitivity_coarse',
  folder: 'Exports',
  region: region,
  scale: 10000,  // 10 km — coarse, but tractable in one shot
  maxPixels: 2.5e8
});