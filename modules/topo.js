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

Geomorpho90m
Amatulli, Giuseppe, Daniel McInerney, Tushar Sethi, Peter Strobl, and Sami Domisch. "Geomorpho90m, empirical evaluation and accuracy assessment of global high-resolution geomorphometric layers." Scientific Data 7, no. 1 (2020): 1-18.

https://gee-community-catalog.org/projects/geomorpho90/


*/


// Modules
var vars = require('users/robitalec/CFS:modules/variables.js');
var hydro = require('users/robitalec/CFS:modules/hydro.js');


// Geometry
var geometry = vars.canada;


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



// Topographic diversity
var topo_diversity_alos = ee.Image("CSP/ERGo/1_0/Global/ALOS_topoDiversity") 
  .rename(['topo_diversity_alos']);
exports.topo_diversity_alos = topo_diversity_alos;


// Geomorpho90m
var slope = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/slope')
  .filterBounds(geometry).mosaic().rename('slope');
var eastness = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/eastness')
  .filterBounds(geometry).mosaic().rename('eastness');
var northness = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/northness')
  .filterBounds(geometry).mosaic().rename('northness');
var convergence = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/convergence')
  .filterBounds(geometry).mosaic().rename('convergence');
var cti = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/cti')
  .filterBounds(geometry).mosaic().rename('cti');
var dx = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/dx')
  .filterBounds(geometry).mosaic().rename('dx');
var dy = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/dy')
  .filterBounds(geometry).mosaic().rename('dy');
var dxy = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/dxy')
  .filterBounds(geometry).mosaic().rename('dxy');
var tri = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/tri')
  .filterBounds(geometry).mosaic().rename('tri');
var tpi = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/tpi')
  .filterBounds(geometry).mosaic().rename('tpi');
var rough_magnitude = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/rough-magnitude')
  .filterBounds(geometry).mosaic().rename('rough-magnitude');
var geom = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/geom')
  .filterBounds(geometry).mosaic().rename('geom');

var geomorpho = ee.Image([
  slope, eastness, northness, convergence, cti, dx, dy,
  dxy, 
  tri, tpi, rough_magnitude,
  geom
  ]);
exports.geomorpho = geomorpho;


// Get sampling collection
var sampling_collection = function() {
  return ee.Image([
  hand(30, 100),
  hand(90, 1000),
  chili_alos,
  topo_diversity_alos,
  geomorpho
  ]);
};
sampling_collection = sampling_collection.map(function(img) {
  return img.updateMask(hydro.water.not());
});
exports.sampling_collection = sampling_collection;