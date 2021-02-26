// Calculate baselines
exports.calcBaseline = function(img, cmiBand, percentileBand) {
  var outname = cmiBand + '-gt-' + percentileBand;

  return img.addBands(
    img.expression(
    'cmi > percentile', {
      'cmi': img.select(cmiBand),
      'percentile': img.select(percentileBand)
    }).rename(outname));
};
