/*
Alec L. Robitaille
*/


// Load modules
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');


var calc_vci = function(images) {
  var band = 'NDVI';
  var max = images.select(band).max();
  var min = images.select(band).min();
  
  return images.map(function(img) {
    // VCI = ((NDVI - NDVI min) X 100) / (NDVI max - NDVI min)
    return img.expression('VCI = ((NDVI - min) * 100) / (max - min) ', {
    NDVI: img.select(band),
    max: max,
    min: min
  }).copyProperties(img);
  });
};


// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);



// Get indices collection
var indices_col = get_landsat.get_indices(2014, 2019, '06-15', '07-15', geometry, ['NDVI', 'EVI']);

// Test: calc_vci
// Usage: calc_vci(images)
var vci_col = calc_vci(indices_col);


// Print
print(indices_col);


// Map
Map.addLayer(indices_col.select(['NDVI']), {min: -0.5, max:1}, 'NDVI collection');
Map.addLayer(vci_col.select(['VCI']), {min: 0, max: 100}, 'VCI collection');
Map.centerObject(geometry);
