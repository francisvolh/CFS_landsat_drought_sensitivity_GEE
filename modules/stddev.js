/*
Standardize
Alec L. Robitaille
*/

// Get standard deviation
var get_standardize = function(images) {
	return images.reduce(ee.Reducer.stdDev());
};
exports.get_standardize = get_standardize;

