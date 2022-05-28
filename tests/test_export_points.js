/*
Testing: modules/exports_points.js
Alec L. Robitaille
*/

// Load modules
var export_points = require('users/robitalec/CFS:modules/export_points.js');

// Set variables
var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);
var min_year = 2000;
var max_year = 2015;
var min_mm_dd = '06-15';
var max_mm_dd = '07-15';
var percentile_list = [10, 20];
var percentile_low = 15;
var percentile_high = 85;
var antecedent = '3mo'
var index_list = ['NDVI', 'NBR'];
var drive_folder = 'Batch-ecoregion-export';
var n_pts = 10;

// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');
ecoregions = ecoregions.filterBounds(geometry).limit(3);



// Test export_by_ecoregion - veg index and ante means
// Usage: export_by_ecoregion(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
export_points.export_by_ecoregion('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list, antecedent);
// Map.addLayer(ecoregions)


// Test export_by_ecoregion_cap - veg index and ante means
// Usage: export_by_ecoregion_cap(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
export_points.export_by_ecoregion_cap('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_low, percentile_high, antecedent);

