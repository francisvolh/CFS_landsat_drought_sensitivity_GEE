var dy = ee.ImageCollection('projects/sat-io/open-datasets/Geomorpho90m/dy')

Map.addLayer(dy)

 
var points = ee.FeatureCollection('users/robitalec/CFS/2023-10-06_sampling_points_tiles_0pt01');


points = points.limit(100)

var values = dy.getRegion(points, 90)
var keys = values.get(0)

keys = ['id', 'longitude', 'latitude', 'time', 'dy']
// keys = keys.replace('b1', 'dy')
print(keys)

print(values.slice(1))

var features = values.slice(1).map(function(o) {
  var properties = ee.Dictionary.fromLists(keys, o)
  return ee.Feature(null, properties)
})

features = ee.FeatureCollection(features)

print(features)
print(features.select('dy'))