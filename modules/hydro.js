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



// Snow
var permanent_snow = land_cover.hermosilla_1984_2019
                        .reduce(ee.Reducer.mode())
                        .eq(31);
exports.permanent_snow = permanent_snow;

// Proportion snow
var proportion_permanent_snow = function(focal_dist) {
  return permanent_snow.focalMean(focal_dist, null, 'meters')
                       .rename('prop_perm_snow_' + focal_dist);
};
exports.proportion_permanent_snow = proportion_permanent_snow;

// Distance snow
var distance_permanent_snow = function() {
  return permanent_snow.distance(ee.Kernel.euclidean(10e3, 'meters'))
                       .rename('distance_perm_snow');
};
exports.distance_permanent_snow = distance_permanent_snow;




// Water
var water = land_cover.hermosilla_1984_2019
                .reduce(ee.Reducer.mode())
                .eq(20);
exports.water = water;

// Proportion water
var proportion_water = function(focal_dist) {
  return water.focalMean(focal_dist, null, 'meters')
              .rename('prop_water_' + focal_dist);
};
exports.proportion_water = proportion_water;

// Distance water lc
var distance_water_lc = function() {
  return water.distance(ee.Kernel.euclidean(10e3, 'meters'))
              .rename('distance_water_lc');
};
exports.distance_water_lc = distance_water_lc;



// Distance major lakes
// Note: searchRadius (Float, default: 100000):
//       Maximum distance in meters from each pixel to look for edges. Pixels will be masked unless there are edges within this distance.
var distance_major_lakes = function(min_lake_area) {
  var lake_poly = ee.FeatureCollection("projects/sat-io/open-datasets/HydroLakes/lake_poly_v10")
    .filter(ee.Filter.eq('Continent', 'North America'))
    .filter(ee.Filter.eq('Country', 'Canada'))
    .filter(ee.Filter.gt('Lake_area', min_lake_area));
  
  return lake_poly.distance().rename('distance_lake_gt_' + min_lake_area + '_sq_km');
};
exports.distance_major_lakes = distance_major_lakes;



// Get sampling collection
var sample_collection = function() {
  return ee.Image([
  proportion_permanent_snow(1000),
  proportion_water(1000),
  proportion_water(300),
  distance_major_lakes(50)
  ]);
};
exports.sample_collection = sample_collection;