/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var bbox = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-144.24684345797587, 68.33032889758721],
          [-144.24684345797587, 48.217369784263724],
          [-108.91481220797588, 48.217369784263724],
          [-108.91481220797588, 68.33032889758721]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Checking TAGEE
// Alec L. Robitaille

// Based on example from TAGEE docs
// https://github.com/zecojls/tagee#minimal-reproducible-example



// Importing module
var TAGEE = require('users/joselucassafanelli/TAGEE:TAGEE-functions');

// Water mask
var hansen_2016 = ee.Image('UMD/hansen/global_forest_change_2016_v1_4').select('datamask');
var hansen_2016_wbodies = hansen_2016.neq(1).eq(0);
var waterMask = hansen_2016.updateMask(hansen_2016_wbodies);


// SRTM 30 m -----------------------------------------------------------------
// Loading SRTM 30 m
var dem_srtm = ee.Image('USGS/SRTMGL1_003').clip(bbox).rename('SRTM');

// Smoothing filter.
var gaussianFilter = ee.Kernel.gaussian({
  radius: 3, sigma: 2, units: 'pixels', normalize: true
});

// Smoothing the DEM with the gaussian kernel.
var smooth_srtm = dem_srtm.convolve(gaussianFilter).resample("bilinear");


// FABDEM -----------------------------------------------------------------
var dem_fab = ee.ImageCollection("projects/sat-io/open-datasets/FABDEM");
dem_fab = dem_fab
  .filterBounds(bbox)
  .mosaic()
  .setDefaultProjection(dem_fab.first().projection())
  .rename('FABDEM');

// Smoothing the DEM with the gaussian kernel
var smooth_fab = dem_fab.convolve(gaussianFilter).resample("bilinear");


// Compare DEMs
Map.addLayer(smooth_srtm, null, 'SRTM', false);
Map.addLayer(smooth_fab, null, 'FABDEM', false);

Map.addLayer(smooth_srtm.subtract(smooth_fab).abs(), null, 'difference SRTM - FABDEM');





// // Terrain analysis

// var DEMAttributes = TAGEE.terrainAnalysis(TAGEE, demSRTM, bbox).updateMask(waterMask);
// print(DEMAttributes.bandNames(), 'Parameters of Terrain');

// // Visualization

// var vizVC = TAGEE.makeVisualization(DEMAttributes, 'MaximalCurvature', 'level2', bbox, 'rainbow');
// var vizVCmean = TAGEE.makeVisualization(DEMAttributes, 'MeanCurvature', 'level2', bbox, 'rainbow');
// Map.addLayer(DEMAttributes.select('MaximalCurvature'))
// Map.addLayer(vizVC, {}, 'MaximalCurvature');
// Map.addLayer(vizVCmean, {}, 'MeanCurvature');
// Map.setCenter(0,0,2);