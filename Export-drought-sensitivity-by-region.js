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
Export drought sensitivity by region
Based on: tests/test_exports.js
Alec L. Robitaille
*/

// Load modules
var export_by = require('users/robitalec/CFS:modules/export_by.js');

// Set variables
var min_year = 1985;
var max_year = 2021;
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';
var percentile_list = [15];
var index_list = ['NDVI', 'NBR'];
var drive_folder = 'Batch-ecoregion-export';
var n_pts = 50;

// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');
ecoregions = ecoregions.filterBounds(geometry).limit(1);



// Usage: export_by_ecoregion(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
export_by.export_by_ecoregion('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
Map.addLayer(ecoregions)
