/*
Get hydro variables
Alec L. Robitaille


HAND
Donchyts, Gennadii, Hessel Winsemius, Jaap Schellekens, Tyler Erickson, Hongkai Gao, Hubert Savenije, and Nick van de Giesen. "Global 30m Height Above the Nearest Drainage (HAND)",
Geophysical Research Abstracts, Vol. 18, EGU2016-17445-3, 2016, EGU General Assembly (2016).

HydroLAKES
Messager, Mathis Loïc, Bernhard Lehner, Günther Grill, Irena Nedeva, and Oliver Schmitt. "Estimating the volume and
age of water stored in global lakes using a geo-statistical approach."
Nature communications 7, no. 1 (2016): 1-11.
https://samapriya.github.io/awesome-gee-community-datasets/projects/hydrolakes/


*/

// Modules
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');



// Get HAND
var get_hand = function(resolution, threshold) {
  if (resolution == 30 & threshold == 100) {
    // Note: image collection vs image
    return ee.ImageCollection("users/gena/global-hand/hand-100");
  } else if (resolution == 30 & threshold == 1000) {
    return ee.Image("users/gena/GlobalHAND/30m/hand-1000");
  } else if (resolution == 90 & threshold == 1000) {
    return ee.Image("users/gena/GlobalHAND/90m-global/hand-1000").select('b1', 'hand-90-1000');
  }
};
exports.get_hand = get_hand;



// Get proportion glacier/permanent snow
var snow_mode = land_cover.hermosilla_plus_2022
                .reduce(ee.Reducer.mode())
                .eq(31);

var get_prop_permanent_snow = function(focal_dist) {
  return snow_mode.focalMean(focal_dist, null, 'meters');
};
exports.get_prop_permanent_snow = get_prop_permanent_snow;
                


// Distance to major lakes
// Note: searchRadius (Float, default: 100000):
//       Maximum distance in meters from each pixel to look for edges. Pixels will be masked unless there are edges within this distance.
var get_dist_major_lakes = function(min_lake_area) {
  var lake_poly = ee.FeatureCollection("projects/sat-io/open-datasets/HydroLakes/lake_poly_v10")
    .filter(ee.Filter.eq('Continent', 'North America'))
    .filter(ee.Filter.eq('Country', 'Canada'))
    .filter(ee.Filter.gt('Lake_area', min_lake_area));
  
  return lake_poly.distance();
};
exports.get_dist_major_lakes = get_dist_major_lakes;