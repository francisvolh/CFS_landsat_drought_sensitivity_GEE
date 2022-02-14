// Calculate baselines
var calcBaseline = function(img, cmiBand, percentileBand) {
  var outname = cmiBand + '-gt-' + percentileBand;

  return img.addBands(
    img.expression(
    'cmi > percentile', {
      'cmi': img.select(cmiBand),
      'percentile': img.select(percentileBand)
    }).rename(outname));
};


var daymet = ee.ImageCollection("NASA/ORNL/DAYMET_V3");

daymet = daymet
  .filter(ee.Filter.calendarRange(6, 6, 'month'))
  .filter(ee.Filter.calendarRange(2011, 2011, 'year'))
  .select('tmax')

daymet = daymet.reduce(ee.Reducer.percentile([50]))
  .addBands(daymet.reduce(ee.Reducer.mean()).rename('mean'))

print(daymet)
var out = calcBaseline(daymet, 'mean', 'tmax_p50')
Map.addLayer(out)
