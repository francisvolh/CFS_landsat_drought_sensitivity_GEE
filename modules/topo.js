/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-141.56230468750002, 69.93960954219672],
          [-141.38652343750002, 59.92457675406434],
          [-136.46464843750002, 58.27755719456903],
          [-133.16875000000002, 56.08717742616617],
          [-129.56523437500002, 51.730985068384896],
          [-128.64238281250002, 48.89781535438178],
          [-123.93342334074529, 47.52920157404958],
          [-121.95588427824529, 48.76066172049473],
          [-115.45197802824529, 48.6736794975307],
          [-108.90412646574529, 48.731684356948755],
          [-101.52131396574529, 48.78962237622374],
          [-95.14924365324529, 48.615607780377495],
          [-90.40314990324529, 47.46982298585049],
          [-91.19416552824529, 46.11602927040468],
          [-88.42561084074529, 45.256464702841846],
          [-87.81536467285937, 41.610674096728076],
          [-82.42107756348437, 41.289525371385416],
          [-78.00457365723437, 42.60501219967713],
          [-74.63531330548527, 44.81292616792487],
          [-70.73516682111027, 44.94526908236288],
          [-66.32964924298527, 43.44085984335447],
          [-65.19805744611027, 43.120938527873925],
          [-59.364317211735276, 45.748269243144755],
          [-58.24096557293104, 46.961421445181905],
          [-56.02172729168104, 46.47182644944785],
          [-52.52807494793104, 46.509645335585525],
          [-52.09960815105604, 47.97144921803748],
          [-53.09936401043104, 49.213923663385856],
          [-54.84619018230604, 50.593616375532214],
          [-55.0780307660765, 52.96238819436331],
          [-58.3629428754515, 55.778883070112805],
          [-60.3185092817015, 56.60409937740015],
          [-62.7355014692015, 59.303050608501785],
          [-64.25250010981273, 61.01706981586282],
          [-80.75396495356273, 64.76125850717452],
          [-117.72295744627965, 69.26102307388543],
          [-123.91924650877965, 70.39722378789422],
          [-128.70928557127965, 70.96418629440889],
          [-135.96026213377965, 70.33816437429702]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Topo
Alec L. Robitaille


HAND
Donchyts, Gennadii, Hessel Winsemius, Jaap Schellekens, Tyler Erickson, Hongkai Gao, Hubert Savenije, and Nick van de Giesen. 
"Global 30m Height Above the Nearest Drainage (HAND)", Geophysical Research Abstracts, 
Vol. 18, EGU2016-17445-3, 2016, EGU General Assembly (2016).


TAGEE
Safanelli, J.L.; Poppiel, R.R.; Ruiz, L.F.C.; Bonfatti, B.R.; Mello, F.A.O.; Rizzo, R.; Demattê, J.A.M. 
Terrain Analysis in Google Earth Engine: A Method Adapted for High-Performance Global-Scale Analysis. 
ISPRS Int. J. Geo-Inf. 2020, 9, 400. DOI: https://doi.org/10.3390/ijgi9060400

https://github.com/zecojls/tagee/blob/master/TAGEE-functions.js

CHILI, Topo diversity, Landforms
Theobald, D. M., Harrison-Atlas, D., Monahan, W. B., & Albano, C. M. (2015). 
Ecologically-relevant maps of landforms and physiographic diversity for climate adaptation planning. PloS one, 10(12),
https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0143619

FABDEM
Hawker, Laurence, Peter Uhe, Luntadila Paulo, Jeison Sosa, James Savage, Christopher Sampson, and Jeffrey Neal. "A 30m global map of elevation with
forests and buildings removed." Environmental Research Letters (2022).


*/


// Modules
var tagee = require('users/joselucassafanelli/TAGEE:TAGEE-functions');



// Get HAND
var hand = function(resolution, threshold) {
  if (resolution == 30 & threshold == 100) {
    // Note: image collection vs image
    return ee.ImageCollection("users/gena/global-hand/hand-100").select(['b1'], ['hand_30_100'])
        .filterBounds(geometry).mosaic();
  } else if (resolution == 30 & threshold == 1000) {
    return ee.Image("users/gena/GlobalHAND/30m/hand-1000").select(['b1'], ['hand_30_1000']);
  } else if (resolution == 90 & threshold == 1000) {
    return ee.Image("users/gena/GlobalHAND/90m-global/hand-1000").select(['b1'], ['hand_90_1000']);
  }
};
exports.hand = hand;



// CHILI
// ALOS some gaps, SRTM only < 60
var chili_alos = ee.Image('CSP/ERGo/1_0/Global/ALOS_CHILI')
  .rename(['chili_alos']);
var chili_srtm = ee.Image('CSP/ERGo/1_0/Global/SRTM_CHILI')
  .rename(['chili_srtm']);
exports.chili_alos = chili_alos;
exports.chili_srtm = chili_srtm;



// CTI



// DEM
var dem = ee.ImageCollection("projects/sat-io/open-datasets/FABDEM");
dem = dem
  .filterBounds(geometry)
  .mosaic()
  .setDefaultProjection(dem.first().projection());

// TAGEE
var smooth_dem = function(dem) {
  // From TAGEE docs
  // Smoothing filter
  var gaussianFilter = ee.Kernel.gaussian({
    radius: 3, sigma: 2, units: 'pixels', normalize: true
  });
  
  // Smoothing the DEM with the gaussian kernel
  return dem.convolve(gaussianFilter).resample("bilinear");
};

var smoothed_dem = smooth_dem(dem);

var tagee_terrain = function(region) {
  var terr = tagee.terrainAnalysis(tagee, smoothed_dem, region);
  
  return terr.select([
    'Elevation', 'Slope', 'Aspect', 'Northness', 'Eastness', 
    'MinimalCurvature', 'MaximalCurvature', 'ShapeIndex']);
};
exports.tagee_terrain = tagee_terrain;

// Visualize TAGEE wrapper
var tagee_viz = function(terrain, band_name, region) {
  return tagee.makeVisualization(
    terrain, 
    band_name, 
    'level2', 
    region, 
    'inferno'
  );
};
exports.tagee_viz = tagee_viz;


// Landforms
// Bad mask instead of gaps filled with values
// var landforms_alos = ee.Image("CSP/ERGo/1_0/Global/ALOS_landforms") 
//   .rename(['landforms_alos']);
// exports.landforms_alos = landforms_alos;

// Topographic diversity
var topo_diversity_alos = ee.Image("CSP/ERGo/1_0/Global/ALOS_topoDiversity") 
  .rename(['topo_diversity_alos']);
exports.topo_diversity_alos = topo_diversity_alos;



// Get sampling collection
var sampling_collection = function() {
  return ee.Image([
  hand(30, 100),
  hand(90, 1000),
  chili_alos,
  topo_diversity_alos,
  tagee_terrain(geometry)
  ]);
};
exports.sampling_collection = sampling_collection;


