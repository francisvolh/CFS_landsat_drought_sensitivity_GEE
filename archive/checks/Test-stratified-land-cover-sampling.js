// === Test stratified land cover sampling ------------------------------------
// Alec L. Robitaille
// Palettes library: Gennadii Donchyts



// Images ---------------------------------------------------------------------
// Hermosilla et al. 2022 land cover
var lc = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");



// Processing -----------------------------------------------------------------
// Grab first year
lc = lc.first();

// Remap
var from = [0, 20, 31, 32, 33, 40, 50, 80, 81, 100, 210, 220, 230];
var to =   [0, 1,  2,  3,  4,  5,  6,  7,  8,  9,   10,  11,  12 ];
lc = lc.remap(from, to).rename('land_cover');

// Also a masked version
var masked_lc = lc.updateMask(lc.eq(1).or(lc.eq(10)));



// Stratified sample ----------------------------------------------------------
// Full land cover
var sampled_points = lc.addBands([ee.Image.pixelLonLat()]).stratifiedSample({
  classBand: 'land_cover',
  numPoints: 100,
  region: geometry
}).map(function(ft) {
  return ft.setGeometry(ee.Geometry.Point([ft.get('longitude'), ft.get('latitude')]));
});

// Masked land cover
var masked_sampled_points = masked_lc.addBands([ee.Image.pixelLonLat()]).stratifiedSample({
  classBand: 'land_cover',
  numPoints: 100,
  region: geometry
}).map(function(ft) {
  return ft.setGeometry(ee.Geometry.Point([ft.get('longitude'), ft.get('latitude')]));
});



// Map ------------------------------------------------------------------------
// Add a white background to hide the map, since some layers are masked
Map.addLayer(ee.Image.constant(1).mask());

// Palette
var palettes = require('users/gena/packages:palettes');
var pal = palettes.crameri.batlow[25];

// Land cover
Map.addLayer(lc, {palette: pal}, 'land cover', false);

// Sampled points
print(sampled_points);
Map.addLayer(sampled_points, null, 'sampled points', false);


// Masked land cover
Map.addLayer(masked_lc, {palette: pal}, 'masked land cover');

// Sample points within masked land cover
Map.addLayer(masked_sampled_points, null, 'sampled points within mask');
