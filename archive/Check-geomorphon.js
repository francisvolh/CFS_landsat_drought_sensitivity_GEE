var vars = require('users/robitalec/CFS:modules/variables.js');


// Geometry
var geometry = vars.canada;



var geom = ee.Image("projects/sat-io/open-datasets/Geomorpho90m/geom/geom_90M_n25e060");

print(geom)

Map.addLayer(geom)
Map.centerObject(geom)
// ui.Chart.image.histogram(image, region, scale, maxBuckets, minBucketWidth, maxRaw, maxPixels) 
print(ui.Chart.image.histogram(geom, geom.geometry(), 5e4, 11, 1))

print('Min', geom.reduceRegion({reducer: ee.Reducer.min(), bestEffort: true}))
print('Max', geom.reduceRegion({reducer: ee.Reducer.max(), bestEffort: true}))

print('Fixed histogram', geom.reduceRegion({reducer: ee.Reducer.fixedHistogram(1, 11, 10), bestEffort: true}))

print('freq histogram', geom.reduceRegion({reducer: ee.Reducer.frequencyHistogram(), bestEffort: true}))

print(ui.Chart.image.histogram(geom, geometry, 5e3, 70, 0.1))

Map.addLayer(geom.gt(7))
Map.setZoom(12)