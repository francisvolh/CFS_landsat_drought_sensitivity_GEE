/*
Standardize
Alec L. Robitaille
*/

// Get standard deviation
var standardize = function(images) {
  var mean = images.reduce(ee.Reducer.mean());
  var stddev = images.reduce(ee.Reducer.stdDev());
	return images.map(function(img) {return img.subtract(mean).divide(stddev)});
};
exports.standardize = standardize;

