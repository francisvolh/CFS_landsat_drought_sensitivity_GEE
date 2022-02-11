/*
Thin wrapper around LandTrendr API
Generates a SR collection in a region, then transforms into spectral indices
Alec L. Robitaille

https://emapr.github.io/LT-GEE/api.html

Kennedy, R.E., Yang, Z., Gorelick, N., Braaten, J., Cavalcante, L.,
Cohen, W.B., Healey, S. (2018). Implementation of the LandTrendr Algorithm
on Google Earth Engine. Remote Sensing. 10, 691.
*/


// Load LandTrendr API
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js');

// Set flags to mask
var mask = ['cloud', 'shadow', 'snow', 'water', 'waterplus'];

// Get collection of Landsat SR bands
var get_SR = function(min_year, max_year, min_mm_dd, max_mm_dd, region) {
  return(ltgee.buildSRcollection(min_year, max_year, min_mm_dd, max_mm_dd, region)
              .map(setYear));
};
exports.get_SR = get_SR;

// Get collection of spectral indices
var get_indices = function(min_year, max_year, min_mm_dd, max_mm_dd, region, indices) {
	var collection = get_SR(min_year, max_year, min_mm_dd, max_mm_dd, region)
                      .map(setYear);

	return(ltgee.transformSRcollection(collection, indices));
};
exports.get_indices = get_indices;


// Set year
var setYear = function(img) {
  return img.set('year', img.date().get('year'));
};
exports.setYear = setYear;
