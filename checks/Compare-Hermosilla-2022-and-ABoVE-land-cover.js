/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-140.8342541645255, 65.4904369738325],
          [-140.8342541645255, 64.78842797948187],
          [-139.191798109838, 64.78842797948187],
          [-139.191798109838, 65.4904369738325]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// === Compare Hermosilla 2022 and ABoVE land cover
// Alec Robitaille



// Load Hermosilla land cover
var hermo = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");

// Load ABoVE land cover
var above = ee.Image("users/mghethcoat/ECCCwork/ABOVE_landcover");



// Select the same year
hermo = hermo.filterDate('2010-01-01', '2011-01-01')
             .first()
             .rename('Hermosilla');

// The uploaded ABoVE data is not an image collection and doesn't have any dates
// So we can't filter but
// the full range of data is 1984-2014, a 31 year window (including bounds)
// therefore, the 2010 image is the 27th image in the collection
above = above.select([27])
             .rename('ABoVE');



// Map
Map.addLayer(hermo);
Map.addLayer(above);



// Sample random points
var points = ee.FeatureCollection.randomPoints(geometry, 100);
var combined = ee.Image([hermo, above]);
var combined_sample = combined.sampleRegions(points);

print(combined_sample);


print(combined_sample.errorMatrix('Hermosilla', 'ABoVE'));
// errorMatrix(actual, predicted, order) 
 