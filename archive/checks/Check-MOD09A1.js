var dataset = ee.ImageCollection('MODIS/006/MOD09A1')
.filter(ee.Filter.date('2018-07-01', '2018-08-01'));
var trueColor =
	dataset.select(['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03']);
var trueColorVis = {
	min: -100.0,
	max: 3000.0,
};
Map.addLayer(trueColor, trueColorVis, 'True Color');

Map.addLayer(dataset.select('QA'))

// A function to mask out cloudy pixels.
var maskClouds = function(image) {
	// Select the QA band.
	var QA = image.select('StateQA')
	// Make a mask to get bit 10, the internal_cloud_algorithm_flag bit.
	var bitMask = 1 << 10;
	// Return an image masking out cloudy areas.
	return image.updateMask(QA.bitwiseAnd(bitMask).eq(0))
}
var bitMask = 1 << 10;

Map.addLayer(dataset.map(maskClouds).select(['sur_refl_b01', 'sur_refl_b04', 'sur_refl_b03']),
						 trueColorVis)
