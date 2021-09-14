var region = 'Yukon';
var yr = 2003;
print('Region selected: ' + region)
print('Year selected: ' + 2003)

// Data -------------------------------------------------------------------------
var indices_modis = ee.Image('users/robitalec/sample-indices-pre-calc-MODIS-' + yr + '-'+ region);
var means_modis = ee.Image('users/robitalec/sample-indices-means-MODIS-' + '-'+ region);

// Landsat
var indices_landsat = ee.Image('users/robitalec/' + 'sample-indices-pre-calc-Landsat-' + yr + '-'+ region);
var means_landast = ee.Image('users/robitalec/sample-indices-means-Landsat-' + '-'+ region);

var geometry =
    ee.Geometry.Polygon(
        [[[-140.9594647158567, 64.06256790235535],
          [-140.9594647158567, 61.98024284713474],
          [-136.0815350283567, 61.98024284713474],
          [-136.0815350283567, 64.06256790235535]]], null, false);


// Functions ---------------------------------------------------------------------
// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Gena's functions
var palettes = require('users/gena/packages:palettes');
var text = require('users/gena/packages:text');
var gallery = require('users/gena/packages:gallery');

var pal = palettes.colorbrewer.RdBu[9].reverse();
var min = -20; var max = 20;
var viz = {min: min, max: max, palette: pal, opacity:0.7};

function showPalette(name, palette) {
  var image = ee.Image.pixelLonLat().select(0)
    .clip(ee.Geometry.Rectangle({coords: [[min, 0], [max, 10]], geodesic: false}))
    .visualize(viz);

  print(name);
  print(ui.Thumbnail(image));
}
// showPalette(min + '           0           ' + max, pal);


// Define a function to convert from degrees to radians.
function radians(img) {
  return img.toFloat().multiply(Math.PI).divide(180);
}

// Define a function to compute a hillshade from terrain data
// for the given sun azimuth and elevation.
function hillshade(az, ze, slope, aspect) {
  // Convert angles to radians.
  var azimuth = radians(ee.Image(az));
  var zenith = radians(ee.Image(ze));
  // Note that methods on images are needed to do the computation.
  // i.e. JavaScript operators (e.g. +, -, /, *) do not work on images.
  // The following implements:
  // Hillshade = cos(Azimuth - Aspect) * sin(Slope) * sin(Zenith) +
  //     cos(Zenith) * cos(Slope)
  return azimuth.subtract(aspect).cos()
    .multiply(slope.sin())
    .multiply(zenith.sin())
    .add(
      zenith.cos().multiply(slope.cos()));
}



// Process ----------------------------------------------------------------------
// Compute terrain meaasures from the SRTM DEM.
var terrain = ee.Algorithms.Terrain(ee.Image("USGS/GMTED2010"));
var slope = radians(terrain.select('slope'));
var aspect = radians(terrain.select('aspect'));

// azimuth, zenith
var az = 120
var ze = 60
var hill = hillshade(az, ze, slope, aspect);


// Filter -----------------------------------------------------------------------
var toview = indices_modis;

// Set the percentile to view
// either 5, 10, or 20
var p = 10;

// Filter the band names before map. Comment any of these out to just map all bands
var selectBands = toview.bandNames()
                        // .filter(ee.Filter.stringContains('item', 'p' + p))
                        .filter(ee.Filter.stringContains('item', 'NBR'))
                        // .filter(ee.Filter.stringContains('item', 'ante3'))

// Or select band
var band = 'NDVI_ante3mo_p10_base';



// Viz --------------------------------------------------------------------------
var vizgallery = {min: min, max: max, palette: pal, opacity:1};


// Map --------------------------------------------------------------------------
// Base layers:
// Constant image
Map.addLayer(ee.Image(1), {palette:'747474'}, 'constant', false);

// Hillshade
Map.addLayer(hill, {opacity:0.7}, az + ' deg', false);


// MODIS and Landsat, selected band
Map.addLayer(indices_modis.select(band), viz, 'MODIS ' + band, false);
Map.addLayer(indices_landsat.select(band), viz, 'Landsat ' + band, false);

// Processed layers:
// MODIS/Landsat dif
// Map.addLayer(dif, {min: -30, max: 30, palette: ["ff0000","ffffff","0014ff"]}, 'dif', false);

// Land cover reverse mask
Map.addLayer(ee.Image('users/robitalec/CFS/land-cover-mask'), null, 'lc', false);


// Charts -----------------------------------------------------------------------
var index = 'NBR'
var ante = 'ante3mo'
var which = 'base'
print(index + ' ' + ante + ' ' + which)
var band = index + '_' + ante + '_p10_' + which
var x = band + '-MOD09Q1'
var y = band + '-Landsat'
var img = ee.Image([indices_modis.select(band).rename(x),
                    indices_landsat.select(band).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'NBR'
var ante = 'ante3mo'
var which = 'drought'
print(index + ' ' + ante + ' ' + which)
var band = index + '_' + ante + '_p10_' + which
var x = band + '-MOD09Q1'
var y = band + '-Landsat'
var img = ee.Image([indices_modis.select(band).rename(x),
                    indices_landsat.select(band).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'NDVI'
var ante = 'ante3mo'
var which = 'drought'
print(index + ' ' + ante + ' ' + which)
var band = index + '_' + ante + '_p10_' + which
var x = band + '-MOD09Q1'
var y = band + '-Landsat'
var img = ee.Image([indices_modis.select(band).rename(x),
                    indices_landsat.select(band).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'NDVI'
var ante = 'ante3mo'
var which = 'drought'
print(index + ' ' + ante + ' ' + which)
var band = index + '_' + ante + '_p10_' + which
var x = band + '-MOD09Q1'
var y = band + '-Landsat'
var img = ee.Image([indices_modis.select(band).rename(x),
                    indices_landsat.select(band).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'EVI'
var ante = 'ante3mo'
var which = 'drought'
print(index + ' ' + ante + ' ' + which)
var band = index + '_' + ante + '_p10_' + which
var x = band + '-MOD09Q1'
var y = band + '-Landsat'
var img = ee.Image([indices_modis.select(band).rename(x),
                    indices_landsat.select(band).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'EVI'
var ante = 'ante3mo'
var which = 'drought'
print(index + ' ' + ante + ' ' + which)
var band = index + '_' + ante + '_p10_' + which
var x = band + '-MOD09Q1'
var y = band + '-Landsat'
var img = ee.Image([indices_modis.select(band).rename(x),
                    indices_landsat.select(band).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)
