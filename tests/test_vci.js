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
    return img.expression('VCI = NDVI', {
    NDVI: img.select(band),
    max: max,
    min: min
  });
  });
};


// Set variables
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);




var calc_vci = function(images) {
  var band = 'NDVI';
  var max = images.select(band).max();
  var min = images.select(band).min();
  
  return images.map(function(img) {
    return img.expression('VCI = NDVI', {
    NDVI: img.select(band),
    max: max,
    min: min
  });
  });
};



// Test indices collection
// Usage: get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region, indices)
var indices_col = get_landsat.get_indices(2014, 2019, '06-15', '07-15', geometry, ['NDVI', 'EVI']);
print(indices_col);




// Map
Map.addLayer(indices_col.select(['NDVI']), {min: -0.5, max:1}, 'NDVI collection');
Map.addLayer(vci_col)

Map.centerObject(geometry);
