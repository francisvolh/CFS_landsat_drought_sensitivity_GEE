/*
Standard devitation
Alec L. Robitaille
*/

// Get standard deviation
var get_stddev = function(images) {
	return images.reduce(ee.Reducer.sampleStdDev());
};
exports.get_stddev = get_stddev;

