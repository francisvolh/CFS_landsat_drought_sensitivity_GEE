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
var p_lapaz = palettes.crameri.lapaz[10];



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
Map.addLayer(topo.tagee_viz(terrain, 'Elevation_radius_' + radius, zoom, geometry), null, 'Elevation_radius_' + radius, true);
Map.addLayer(topo.tagee_viz(terrain, 'Slope_radius_' + radius, zoom, geometry), null, 'Slope_radius_' + radius, false);
Map.addLayer(topo.tagee_viz(terrain, 'Aspect_radius_' + radius, zoom, geometry), null, 'Aspect_radius_' + radius, false);
Map.addLayer(topo.tagee_viz(terrain, 'Northness_radius_' + radius, zoom, geometry), null, 'Northness_radius_' + radius, false);
Map.addLayer(topo.tagee_viz(terrain, 'Eastness_radius_' + radius, zoom, geometry), null, 'Eastness_radius_' + radius, false);
Map.addLayer(topo.tagee_viz(terrain, 'MinimalCurvature_radius_' + radius, zoom, geometry), null, 'MinimalCurvature_radius_' + radius, false);
Map.addLayer(topo.tagee_viz(terrain, 'MaximalCurvature_radius_' + radius, zoom, geometry), null, 'MaximalCurvature_radius_' + radius, false);
Map.addLayer(topo.tagee_viz(terrain, 'ShapeIndex_radius_' + radius, zoom, geometry), null, 'ShapeIndex_radius_' + radius, false);



// Test Geomorpho90
var geomorpho = topo.geomorpho;
print('Geomorpho90', geomorpho);

Map.addLayer(geomorpho.select('geom'), {min: 1, max: 10, palette: p_lapaz}, 'geom', true);
Map.addLayer(geomorpho.select('slope'), {min: 0, max: 40, palette: p}, 'slope', false);
Map.addLayer(geomorpho.select('eastness'), {min: -0.5, max: 0.5, palette: p}, 'eastness', false);
Map.addLayer(geomorpho.select('northness'), {min: -0.5, max: 0.5, palette: p}, 'northness', false);
Map.addLayer(geomorpho.select('convergence'), {min: -50, max: 10, palette: p}, 'convergence', false);
Map.addLayer(geomorpho.select('spi'), {min: 0, max: 250, palette: p}, 'spi', true);
Map.addLayer(geomorpho.select('cti'), {min: -5, max: 5, palette: p}, 'cti', false);
Map.addLayer(geomorpho.select('dx'), {min: -0.5, max: 0.5, palette: p}, 'dx', false);
Map.addLayer(geomorpho.select('dy'), {min: -0.5, max: 0.5, palette: p}, 'dy', false);
Map.addLayer(geomorpho.select('dxx'), {min: -0.05, max: 0.05, palette: p}, 'dxx', false);
Map.addLayer(geomorpho.select('dxy'), {min: -0.05, max: 0.05, palette: p}, 'dxy', false);
Map.addLayer(geomorpho.select('dyy'), {min: -0.05, max: 0.05, palette: p}, 'dyy', false);
Map.addLayer(geomorpho.select('roughness'), {min: 0, max: 200, palette: p}, 'roughness', true);
Map.addLayer(geomorpho.select('tri'), {min: 0, max: 60, palette: p}, 'tri', true);
Map.addLayer(geomorpho.select('tpi'), {min: -4, max: 4, palette: p}, 'tpi', true);
Map.addLayer(geomorpho.select('rough-magnitude'), {min: 0, max: 30, palette: p}, 'rough-magnitude', false);



// Test sampling_collection
// Usage: sampling_collection();
var col = topo.sampling_collection();
print('Sampling collection', col);
