// === Compare Hermosilla 2022 and ABoVE land cover
// Alec Robitaille



// Load Hermosilla land cover
var hermo = ee.ImageCollection("projects/sat-io/open-datasets/CA_FOREST_LC_VLCE2");

// Load ABoVE land cover
var above = ee.Image("users/mghethcoat/ECCCwork/ABOVE_landcover");



// Select the same year
hermo = hermo.filterDate('2010-01-01', '2011-01-01')
             .first();

// The uploaded ABoVE data is not an image collection and doesn't have any dates
// So we can't filter but
// the full range of data is 1984-2014, a 31 year window (including bounds)
// therefore, the 2010 image is the 27th image in the collection
above = above.select([27]);



// Remap, with fake two fake classes in Hermosilla to match dims
hermo = hermo.remap([0, 20, 31, 32, 33, 40, 50, 80, 81, 100, 210, 220, 230, 999, 999],
                    [0, 1,  2,  3,  4,  5,  6,  7,  8,  9,   10,  11,  12,  13,  14])
             .rename('Hermosilla');
// Since errorMatrix requires starting at 0
above = above.remap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,  10, 11, 12, 13, 14])
             .rename('ABoVE');



// Map
Map.addLayer(hermo);
Map.addLayer(above);



// Sample random points, in large region to cover all classes
var points = ee.FeatureCollection.randomPoints(geometry, 1000);
var combined = ee.Image([hermo, above]);
var combined_sample = combined.sampleRegions(points);

print(combined_sample);


// Error matrix
var error_matrix = combined_sample.errorMatrix('ABoVE', 'Hermosilla');
print(error_matrix)


// Export
var export_matrix = ee.FeatureCollection(ee.Feature(null, {matrix: error_matrix.array()}));
Export.table.toDrive(export_matrix, 'error-matrix', 'Drought-sensitivity-refugia');
