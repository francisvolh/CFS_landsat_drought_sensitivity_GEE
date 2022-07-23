/*
Variables
Alec L. Robitaille
*/

var region = ee.FeatureCollection(geometry);
var index = ['NDVI'];
var antecedent = ['3mo'];
var min_year = 1985;
var max_year = 2021;
var min_mm_dd = '07-01';
var max_mm_dd = '07-31';