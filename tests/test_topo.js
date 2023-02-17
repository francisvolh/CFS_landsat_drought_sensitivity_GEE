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
        [[[-136.21751476853268, 63.875723800342705],
          [-136.21751476853268, 56.77224576663849],
          [-106.5104835185327, 56.77224576663849],
          [-106.5104835185327, 63.875723800342705]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Testing: modules/topo.js
Alec L. Robitaille
*/


// Load modules
var topo = require('users/robitalec/CFS:modules/topo.js');

// Palette
var palettes = require('users/gena/packages:palettes');
var p = palettes.crameri.lajolla[50];



// Test hand
// Usage: hand(resolution, threshold)
var hand_30_100 = topo.hand(30, 100);
print('Hand 30 100', hand_30_100);
Map.addLayer(hand_30_100, {min:0, max:500, palette:p}, 'hand 30 100');

var hand_30_1000 = topo.hand(30, 1000);
print('Hand 30 1000', hand_30_1000);
Map.addLayer(hand_30_1000, {min:0, max:500, palette:p}, 'hand 30 1000', false);

var hand_90_1000 = topo.hand(90, 1000);
print('Hand 90 1000', hand_90_1000);
Map.addLayer(hand_90_1000, {min:0, max:500, palette:p}, 'hand 90 1000', false);



// Test CHILI
var chili = topo.chili_alos;
print('CHILI', chili);
Map.addLayer(chili, null, 'CHILI');

// Test topo_diversity
var topo_diversity = topo.topo_diversity_alos;
print('topo_diversity', topo_diversity);
Map.addLayer(topo_diversity, null, 'topo_diversity');



// Test TAGEE
var terrain = topo.tagee_terrain(geometry);
print('Terrain TAGEE', terrain);
Map.addLayer(topo.tagee_viz(terrain, 'Elevation', geometry), null, 'Elevation');
Map.addLayer(topo.tagee_viz(terrain, 'Slope', geometry), null, 'Slope');
Map.addLayer(topo.tagee_viz(terrain, 'Aspect', geometry), null, 'Aspect');
Map.addLayer(topo.tagee_viz(terrain, 'Northness', geometry), null, 'Northness');
Map.addLayer(topo.tagee_viz(terrain, 'Eastness', geometry), null, 'Eastness');
Map.addLayer(topo.tagee_viz(terrain, 'MinimalCurvature', geometry), null, 'MinimalCurvature');
Map.addLayer(topo.tagee_viz(terrain, 'MaximalCurvature', geometry), null, 'MaximalCurvature');
Map.addLayer(topo.tagee_viz(terrain, 'ShapeIndex', geometry), null, 'ShapeIndex');


// Test sampling_collection
// Usage: sampling_collection();
var col = topo.sampling_collection();
print('Sampling collection', col);
