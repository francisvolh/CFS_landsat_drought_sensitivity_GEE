/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-133.82366146161726, 61.11465180698833],
          [-133.82366146161726, 59.28054068252197],
          [-131.53850521161726, 59.28054068252197],
          [-131.53850521161726, 61.11465180698833]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Load Hermosilla land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");



lc = lc.first();


var from = [0, 20, 31, 32, 33, 40, 50, 80, 81, 100, 210, 220, 230];
var to =   [0, 1,  2,  3,  4,  5,  6,  7,  8,  9,   10,  11,  12 ];
lc = lc.remap(from, to).rename('land-cover');


var palettes = require('users/gena/packages:palettes')
Map.addLayer(lc, {palette: palettes.colorbrewer.Set1[12]}, 'land cover');

//  0   Unclassified
//  20  Water
//  31  Snow/Ice
//  32  Rock/Rubble
//  33  Exposed/Barren Land
//  40  Bryoids
//  50  Shrubs
//  80  Wetland
//  81  Wetland Treed
//  100 Herbs
//  210 Coniferous
//  220 Broad Leaf
//  230 Mixedwood

var sampled_points = lc.stratifiedSample({
  classBand: 'land-cover',
  numPoints: 100,
  region: geometry
});

print(sampled_points)
Map.addLayer(sampled_points);
