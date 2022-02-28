/*
Standardize
Alec L. Robitaille
*/

// Get standard deviation
var get_stddev = function(images) {
	return images.reduce(ee.Reducer.stdDev());
};
exports.get_stddev = get_stddev;

