/*
Test modules/fire.js
Alec L. Robitaille

*/


// Load fire module
var fire = require('users/robitalec/CFS:modules/fire.js');


// Geometry
var geometry = ee.Geometry.Polygon([[[-107.279, 59.673], [-107.279, 58.941],
                                    [-105.988, 58.941], [-105.988, 59.673]]]);


// Test five year fires
// Usage: fire.five_year_fires(year)
var five_year_fires = fire.five_year_fires(2013);
print(five_year_fires);



// Map
Map.addLayer(five_year_fires)