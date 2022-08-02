/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-168.54997439051382, 71.83257848283961],
          [-168.54997439051382, 38.21307697867719],
          [-79.25309939051384, 38.21307697867719],
          [-79.25309939051384, 71.83257848283961]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Get hydro variables
Alec L. Robitaille


HydroLAKES
Messager, Mathis Loïc, Bernhard Lehner, Günther Grill, Irena Nedeva, and Oliver Schmitt. "Estimating the volume and
age of water stored in global lakes using a geo-statistical approach."
Nature communications 7, no. 1 (2016): 1-11.
https://samapriya.github.io/awesome-gee-community-datasets/projects/hydrolakes/


*/

// Modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');



// Get proportion glacier/permanent snow
var get_prop_permanent_snow = function(focal_dist) {
  var snow_mode = land_cover.hermosilla_1984_2019
                    .reduce(ee.Reducer.mode())
                    .eq(31);
                
  return snow_mode.focalMean(focal_dist, null, 'meters').rename('prop_perm_snow_' + focal_dist);
};
exports.get_prop_permanent_snow = get_prop_permanent_snow;
                
// Get proportion water
var water_mode = land_cover.hermosilla_plus_2022
                           .reduce(ee.Reducer.mode())
                           .eq(20);
                
var get_prop_water = function(focal_dist) {
  return water_mode.focalMean(focal_dist, null, 'meters').rename('prop_water_' + focal_dist);
};
exports.get_prop_water = get_prop_water;


// Distance to major lakes
// Note: searchRadius (Float, default: 100000):
//       Maximum distance in meters from each pixel to look for edges. Pixels will be masked unless there are edges within this distance.
var get_dist_major_lakes = function(min_lake_area) {
  var lake_poly = ee.FeatureCollection("projects/sat-io/open-datasets/HydroLakes/lake_poly_v10")
    .filter(ee.Filter.eq('Continent', 'North America'))
    .filter(ee.Filter.eq('Country', 'Canada'))
    .filter(ee.Filter.gt('Lake_area', min_lake_area));
  
  return lake_poly.distance().rename('dist_lake_gt_' + min_lake_area + '_sq_km');
};
exports.get_dist_major_lakes = get_dist_major_lakes;



// Get sampling collection
var get_col = function() {
  return ee.Image([
  get_prop_permanent_snow(1000),
  get_prop_water(1000),
  get_prop_water(300),
  get_dist_major_lakes(50)
  ]);
};
exports.get_col = get_col;