var L4 = ee.ImageCollection("LANDSAT/LT04/C01/T1_SR");
var L5 = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR");
var L7 = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR");
var L8 = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR");


var countL4 = L4.reduceToImage(['SATELLITE'], ee.Reducer.count());
var countL5 = L5.reduceToImage(['SATELLITE'], ee.Reducer.count());
var countL7 = L7.reduceToImage(['SATELLITE'], ee.Reducer.count());
var countL8 = L8.reduceToImage(['SATELLITE'], ee.Reducer.count());


Map.addLayer(countL4, {min:0, max:200, gamma:1.74}, 'count L4');
Map.addLayer(countL5, {min:0, max:200, gamma:1.74}, 'count L5');
Map.addLayer(countL7, {min:0, max:200, gamma:1.74}, 'count L7');
Map.addLayer(countL8, {min:0, max:200, gamma:1.74}, 'count L8');
