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

// Load utils
var utils = require('users/robitalec/CFS:modules/utils.js');


// Set flags to mask
var mask = ['cloud', 'shadow', 'snow', 'water', 'waterplus'];


// Get collection of Landsat SR bands
var get_SR = function(min_year, max_year, min_mm_dd, max_mm_dd, region) {
  return(ltgee.buildSRcollection(min_year, max_year, min_mm_dd, max_mm_dd, region, mask)
              .map(utils.set_year)
              .map(function(img) {
                return img.divide(1000)
                          .set('system:time_start', img.get('system:time_start'))
                          .copyProperties(img);
              }));
};
exports.get_SR = get_SR;

// Get collection of spectral indices
var get_indices = function(min_year, max_year, min_mm_dd, max_mm_dd, region, indices) {
	var collection = ltgee.buildSRcollection(min_year, max_year, min_mm_dd, max_mm_dd, region, mask);

	return(ltgee.transformSRcollection(collection, indices)
              .map(utils.set_year)
              .map(utils.add_year_band)
              .map(function(img) {
                return img.divide(1000)
                          .set('system:time_start', img.get('system:time_start'))
                          .copyProperties(img);
              }));
};
exports.get_indices = get_indices;


// Get indices, qualityMosaic on NDVI
var get_indices_greenest = function(min_year, max_year, min_mm_dd, max_mm_dd, region, indices) {
  var years = [min_year, max_year];
  
  var year_col = years.map(function(yr) {
    var collection = ltgee.getCombinedSRcollection(yr, min_mm_dd, max_mm_dd, region, mask);
    var col_w_indices = ltgee.transformSRcollection(collection, indices);
    return col_w_indices
  // return col_w_indices.map(function(img) {
  //   return img.mask(img.select('B1').neq(0)
  //                     .and(img.select('B2').neq(0))
  //                     .and(img.select('B3').neq(0))
  //                     .and(img.select('NDVI').lt(0.98)))
  //             .qualityMosaic('NDVI');
  //   }).map(utils.set_year)
  //     .map(utils.add_year_band)
  //     .map(function(img) {
  //       return img.divide(1000)
  //                 .set('system:time_start', img.get('system:time_start'))
  //                 .copyProperties(img);
  //     });
  });
};
exports.get_indices_greenest = get_indices_greenest;

