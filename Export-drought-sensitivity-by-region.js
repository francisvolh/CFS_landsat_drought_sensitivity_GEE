/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-119.41006076127307, 60.05858985688522],
          [-119.41006076127307, 55.818937456667584],
          [-109.93984591752307, 55.818937456667584],
          [-109.93984591752307, 60.05858985688522]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Export drought sensitivity by region
Based on: tests/test_exports.js
Alec L. Robitaille
*/

// Load modules
var export_by = require('users/robitalec/CFS:modules/export.js');

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
ecoregions = ecoregions.filterBounds(geometry);



// Usage: export_by_ecoregion(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list)
export_by.export_by_ecoregion('vegetation index and antecedent means', drive_folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
Map.addLayer(ecoregions)
