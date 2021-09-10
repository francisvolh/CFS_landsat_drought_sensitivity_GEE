var region = 'Yukon';
var yr = 2003;
print('Region selected: ' + region)
print('Year selected: ' + 2003)

// Data -------------------------------------------------------------------------
// Drought sensitivity
var indices_modis = ee.Image('users/robitalec/CFS/drought-sensitivity-MODIS-' + region);

// Landsat
var sens_land = ee.Image('users/robitalec/CFS/drought-sensitivity-Landsat-' + '2000_2012-' + region);

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

var geometry =
    ee.Geometry.Polygon(
        [[[-140.9594647158567, 64.06256790235535],
          [-140.9594647158567, 61.98024284713474],
          [-136.0815350283567, 61.98024284713474],
          [-136.0815350283567, 64.06256790235535]]], null, false);


// Functions ---------------------------------------------------------------------
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
var toview = sens_land;

// Set the percentile to view
// either 5, 10, or 20
var p = 10;

// Filter the band names before map. Comment any of these out to just map all bands
var selectBands = toview.bandNames()
                        // .filter(ee.Filter.stringContains('item', 'p' + p))
                        .filter(ee.Filter.stringContains('item', 'NBR'))
                        // .filter(ee.Filter.stringContains('item', 'ante3'))

// Or select band
var band = 'Sens_NBR_ante12mo_p10';



// Viz --------------------------------------------------------------------------
var vizgallery = {min: min, max: max, palette: pal, opacity:1};


// Map --------------------------------------------------------------------------
// Base layers:
// Constant image
Map.addLayer(ee.Image(1), {palette:'747474'}, 'constant', false);

// Hillshade
Map.addLayer(hill, {opacity:0.7}, az + ' deg', false);

// CTEF regions
Map.addLayer(ctef, null, 'ctef', false);

// MODIS and Landsat, selected band
Map.addLayer(sens_modis.select(band), viz, 'MODIS ' + band, false);
Map.addLayer(sens_land.select(band), viz, 'Landsat ' + band, false);

// Processed layers:
// MODIS/Landsat dif
// Map.addLayer(dif, {min: -30, max: 30, palette: ["ff0000","ffffff","0014ff"]}, 'dif', false);

// Land cover reverse mask
Map.addLayer(ee.Image('users/robitalec/CFS/land-cover-mask'), null, 'lc', false);


// Charts -----------------------------------------------------------------------
var index = 'NBR'
print('Compare Landsat and MODIS: ' + index)
var p = 10
var band3 = 'Sens_' + index + '_ante3mo_p' + p
var band6 = 'Sens_' + index + '_ante6mo_p' + p
var band12 = 'Sens_' + index + '_ante12mo_p' + p
var x = band3 + '-MOD09Q1'
var y = band3 + '-Landsat'
var img = ee.Image([sens_modis.select(band3).rename(x),
                    sens_land.select(band3).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)