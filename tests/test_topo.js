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
        [[[-141.31517101853268, 68.15211067897617],
          [-141.31517101853268, 46.34117939716444],
          [-52.897202268532695, 46.34117939716444],
          [-52.897202268532695, 68.15211067897617]]], null, false);
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
var radius = 3;
var terrain = topo.tagee_terrain(geometry, radius);
print('Terrain TAGEE', terrain);

var zoom = 4;
Map.addLayer(topo.tagee_viz(terrain, 'Elevation', zoom, geometry), null, 'Elevation');
Map.addLayer(topo.tagee_viz(terrain, 'Slope', zoom, geometry), null, 'Slope');
Map.addLayer(topo.tagee_viz(terrain, 'Aspect', zoom, geometry), null, 'Aspect');
Map.addLayer(topo.tagee_viz(terrain, 'Northness', zoom, geometry), null, 'Northness');
Map.addLayer(topo.tagee_viz(terrain, 'Eastness', zoom, geometry), null, 'Eastness');
Map.addLayer(topo.tagee_viz(terrain, 'MinimalCurvature', zoom, geometry), null, 'MinimalCurvature');
Map.addLayer(topo.tagee_viz(terrain, 'MaximalCurvature', zoom, geometry), null, 'MaximalCurvature');
Map.addLayer(topo.tagee_viz(terrain, 'ShapeIndex', zoom, geometry), null, 'ShapeIndex');


// Test sampling_collection
// Usage: sampling_collection();
var col = topo.sampling_collection();
print('Sampling collection', col);
