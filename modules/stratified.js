/*
Stratified sampling
Alec L. Robitaille
*/


// Note unless seed is changed, always same points
var stratified_sample = function(img, band, region, n_pts) {
	return img.addBands([ee.Image.pixelLonLat()]).stratifiedSample({
		classBand: band,
		numPoints: n_pts,
		region: region
	}).map(function(ft) {
		return ft.setGeometry(ee.Geometry.Point([ft.get('longitude'), ft.get('latitude')]));
	});
};
exports.stratified_sample = stratified_sample;

