/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-141.4430528814123, 68.27919277463084],
          [-141.13300806589254, 64.04137893026935],
          [-139.73426050644431, 60.04815657459371],
          [-126.34684688322079, 49.10211106287488],
          [-108.90484061318891, 49.055202844054236],
          [-91.79138600476233, 48.67346079998252],
          [-95.41638550817073, 59.939877470328504],
          [-99.80739862269407, 62.42033801780019],
          [-108.28910573882132, 65.53581583394379],
          [-128.65907556424258, 68.27919277463084]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/get_long_term_climate.js
Alec L. Robitaille
*/


// Load modules
var climate = require('users/robitalec/CFS:modules/get_long_term_climate.js');

// Set variables
var years = ee.List.sequence(1985, 2020);



// Test get_long_term_climate
// Usage: get_long_term_climate(year_list)
var long_climate = climate.get_long_term_climate(years);
print(long_climate);
Map.addLayer(long_climate.select('tmean_mean'), {min:-20, max:20}, 'mean annual tmean');
Map.addLayer(long_climate.select('prcp_mean'), {min:100, max:4000}, 'mean annual sum prcp');
