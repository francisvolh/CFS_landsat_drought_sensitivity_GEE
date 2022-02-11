/*
Utilities
Alec L. Robitaille
*/

// Set year
var set_year = function(img) {
	return img.set('year', img.date().get('year'));
};
exports.set_year = set_year;
