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

CHILI
Theobald, D. M., Harrison-Atlas, D., Monahan, W. B., & Albano, C. M. (2015). 
Ecologically-relevant maps of landforms and physiographic diversity for climate adaptation planning. PloS one, 10(12),
https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0143619

*/


// Modules
var tagee = require('users/joselucassafanelli/TAGEE:TAGEE-functions');



// Get HAND
var geometry =
    ee.Geometry.Polygon(
        [[[-168.54997439051382, 71.83257848283961],
          [-168.54997439051382, 38.21307697867719],
          [-79.25309939051384, 38.21307697867719],
          [-79.25309939051384, 71.83257848283961]]], null, false);

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
var chili_alos = ee.Image("CSP/ERGo/1_0/Global/ALOS_CHILI");
var chili_srtm = ee.Image('CSP/ERGo/1_0/Global/SRTM_CHILI');
exports.chili_alos = chili_alos.rename('chili_alos');
exports.chili_srtm = chili_srtm;


// CTI


// Curvature
// Min, max

// Shape index



// Get sampling collection
var sampling_collection = function() {
  return ee.Image([
  hand(30, 100),
  hand(90, 1000),
  chili_alos
  ]);
};
exports.sampling_collection = sampling_collection;

