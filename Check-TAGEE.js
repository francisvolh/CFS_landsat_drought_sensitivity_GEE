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
        [[[-142.70462583604083, 70.37745245284577],
          [-142.70462583604083, 49.49589802117177],
          [-87.68509458604083, 49.49589802117177],
          [-87.68509458604083, 70.37745245284577]]], null, false);
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


// === Compare smoothed DEMs 
// SRTM 30 m
// Loading SRTM 30 m
var dem_srtm = ee.Image('USGS/SRTMGL1_003').clip(bbox).rename('SRTM');

// Smoothing filter.
var gaussianFilter = ee.Kernel.gaussian({
  radius: 3, sigma: 2, units: 'pixels', normalize: true
});

// Smoothing the DEM with the gaussian kernel.
var smooth_srtm = dem_srtm.convolve(gaussianFilter).resample("bilinear");


// FABDEM
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

var vis_dif_dem = {min:-50, max:50, palette:["ff0404","ffffff","004eff"]};
Map.addLayer(smooth_srtm.subtract(smooth_fab), vis_dif_dem, 'difference SRTM - FABDEM');

// Recall: FABDEM = forests and buildings removed dem
// https://www.fathom.global/product/fabdem/


// === Compare TAGEE results 
var tagee_srtm = TAGEE.terrainAnalysis(TAGEE, smooth_srtm, bbox).updateMask(waterMask);
var tagee_fab = TAGEE.terrainAnalysis(TAGEE, smooth_fab, bbox).updateMask(waterMask);


// Visualization
var viz_max_srtm = TAGEE.makeVisualization(tagee_srtm, 'MaximalCurvature', 'level2', bbox, 'inferno');
var viz_max_fab = TAGEE.makeVisualization(tagee_fab, 'MaximalCurvature', 'level2', bbox, 'inferno');

Map.addLayer(tagee_srtm.select('MaximalCurvature'), null, 'MaximalCurvature Raw SRTM', false);
Map.addLayer(tagee_fab.select('MaximalCurvature'), null, 'MaximalCurvature Raw FAB', false);
Map.addLayer(viz_max_srtm, {}, 'MaximalCurvature SRTM');
Map.addLayer(viz_max_fab, {}, 'MeanCurvature FAB');