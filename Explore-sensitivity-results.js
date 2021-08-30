/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry2 = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[-147.8210336191388, 70.07926665876009],
                  [-147.8210336191388, 47.928518609971924],
                  [-93.5925179941388, 47.928518609971924],
                  [-93.5925179941388, 70.07926665876009]]], null, false),
            {
              "system:index": "0"
            })]),
    geometryYukon = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-140.97749192943172, 64.6302003963719],
          [-140.97749192943172, 63.06662186618014],
          [-137.43989427318172, 63.06662186618014],
          [-137.43989427318172, 64.6302003963719]]], null, false),
    geolabelYukon = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Point([-140.94764181339778, 64.61367045208839]),
    geometryAlberta = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-119.9213387294983, 57.103879623207106],
          [-119.9213387294983, 53.998563512094734],
          [-113.5822274013733, 53.998563512094734],
          [-113.5822274013733, 57.103879623207106]]], null, false),
    geolabelAlberta = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Point([-119.9213387294983, 57.09791227473051]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var region = 'Alberta';
print('Region selected: ' + region)

// Data -------------------------------------------------------------------------
// Drought sensitivity
var sens_modis_old = ee.Image('users/robitalec/CFS/drought-sensitivity-MODIS-' + region);
var sens_modis = ee.Image('users/robitalec/CFS/drought-sensitivity-MOD09Q1-' + '2000_2012-2-' + region);
var sens_modis_full = ee.Image('users/robitalec/CFS/drought-sensitivity-MOD09Q1-' + region);

// Landsat
var sens_land = ee.Image('users/robitalec/CFS/drought-sensitivity-Landsat-' + '2000_2012-' + region);
var sens_land_full = ee.Image('users/robitalec/CFS/drought-sensitivity-Landsat-' + region);

// Load CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
// ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Geometry for strips
if (region == 'Alberta') {
  var geometry = geometryAlberta;
  var geolabel = geolabelAlberta;
} else if (region == 'Yukon') {
  var geometry = geometryYukon;
  var geolabel = geolabelYukon;
}

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

function summary(img) {
  return img.reduceRegion({
    reducer: ee.Reducer.mean(),
      // ee.Reducer.min().combine(
      // ee.Reducer.max()).combine(
      //   ee.Reducer.mean()),
    geometry: ctef,
    bestEffort: true
  });
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

// Or select period and percentile (to flex index)
var forindex = toview.bandNames()
                     .filter(ee.Filter.stringContains('item', 'p' + p))
                     .filter(ee.Filter.stringContains('item', 'ante12mo'));

// As a collection
var ascol = ee.ImageCollection.fromImages(toview.select(selectBands).bandNames().map(function(name) {
  return toview.select([name]).set({"name": ee.String(name)
  });
}));

// Dif --------------------------------------------------------------------------
var b = 'Sens_NDVI_ante12mo_p10'
var dif = sens_modis.select(b).subtract(sens_modis_old.select(b));
// print(ui.Chart.image.histogram({image: dif, region: geometry, maxBuckets: 100}))

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

// Gallery ----------------------------------------------------------------------
var selectBands = toview.bandNames()
                        .filter(ee.Filter.stringEndsWith('item', '5'))
                        // .filter(ee.Filter.or(ee.Filter.stringEndsWith('item', '5'),
                        //                     ee.Filter.stringEndsWith('item', '10'),
                        //                     ee.Filter.stringEndsWith('item', '20')))

// Within Landsat gallery strip
var toview = sens_land
var ascol = ee.ImageCollection.fromImages(toview.select(selectBands).bandNames().map(function(name) {
  return toview.select([name]).set({"name": ee.String(name)
  });
}));
var imagesRGB = ascol.map(function(img) {
  var label = text.draw(img.get('name'), geolabel, Map.getScale(), {
      fontSize:32, textColor: '000000', outlineColor: 'ffffff', outlineWidth: 1, outlineOpacity: 0.6});
  return img.visualize(vizgallery).blend(label);
});

var rows = 3;
var columns = 3;
var wisensor = gallery.draw(ee.ImageCollection(imagesRGB), geometry.bounds(), rows, columns);
Map.addLayer(wisensor, null, 'gallery: within Landsat', false);

// Within MODIS gallery strip
var toview = sens_modis
var ascol = ee.ImageCollection.fromImages(toview.select(selectBands).bandNames().map(function(name) {
  return toview.select([name]).set({"name": ee.String(name)
  });
}));
var imagesRGB = ascol.map(function(img) {
  var label = text.draw(img.get('name'), geolabel, Map.getScale(), {
      fontSize:32, textColor: '000000', outlineColor: 'ffffff', outlineWidth: 1, outlineOpacity: 0.6});
  return img.visualize(vizgallery).blend(label);
});

var rows = 3;
var columns = 3;
var wisensor = gallery.draw(ee.ImageCollection(imagesRGB), geometry.bounds(), rows, columns);
Map.addLayer(wisensor, null, 'gallery: within MODIS', false);

// Across sensor gallery strip
var selectBands = toview.bandNames()
                        .filter(ee.Filter.stringEndsWith('item', '5'))
                        .filter(ee.Filter.stringContains('item', 'ante12mo'))
var comb = ee.Image([sens_modis.select(selectBands),
                     sens_land.select(selectBands)])
var combcol = ee.ImageCollection.fromImages(comb.bandNames().map(function(name) {
  return comb.select([name]).set({"name": ee.String(name)})
}));
var imagesRGB = combcol.map(function(img) {
  var label = text.draw(img.get('name'), geolabel, Map.getScale(), {
      fontSize:32, textColor: '000000', outlineColor: 'ffffff', outlineWidth: 1, outlineOpacity: 0.6});
  return img.visualize(vizgallery).blend(label);
});

var rows = 2;
var columns = 3;
var acrosssensors = gallery.draw(ee.ImageCollection(imagesRGB), geometry.bounds(), rows, columns);
Map.addLayer(acrosssensors, null, 'gallery: MODIS (top) Landsat (bottom)', false);

// Add all bands separately
// Note, there's a bit of server side logic here so the browser might hang briefly
// Get the list of band names and add them all separately to the map
// By default all are added, but not shown - so you'll need to select the one to view
// After you view one, make sure to set it off so you are only seeing one later at a time
// var bandList = selectBands.getInfo();
// for (var i = 0; i < bandList.length; i++) {
//   Map.addLayer(toview.select(bandList[i]), viz, bandList[i], false);
// }

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

var x = band6 + '-MOD09Q1'
var y = band6 + '-Landsat'
var img = ee.Image([sens_modis.select(band6).rename(x),
                    sens_land.select(band6).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var x = band12 + '-MOD09Q1'
var y = band12 + '-Landsat'
var img = ee.Image([sens_modis.select(band12).rename(x),
                    sens_land.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'NDVI'
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

var x = band6 + '-MOD09Q1'
var y = band6 + '-Landsat'
var img = ee.Image([sens_modis.select(band6).rename(x),
                    sens_land.select(band6).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var x = band12 + '-MOD09Q1'
var y = band12 + '-Landsat'
var img = ee.Image([sens_modis.select(band12).rename(x),
                    sens_land.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'EVI'
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

var x = band6 + '-MOD09Q1'
var y = band6 + '-Landsat'
var img = ee.Image([sens_modis.select(band6).rename(x),
                    sens_land.select(band6).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var x = band12 + '-MOD09Q1'
var y = band12 + '-Landsat'
var img = ee.Image([sens_modis.select(band12).rename(x),
                    sens_land.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

//
var index = 'EVI'
print('Compare Landsat and MODIS - full time series: ' + index)
var p = 10
var band3 = 'Sens_' + index + '_ante3mo_p' + p
var band6 = 'Sens_' + index + '_ante6mo_p' + p
var band12 = 'Sens_' + index + '_ante12mo_p' + p
var x = band3 + '-MOD09Q1'
var y = band3 + '-Landsat'
var img = ee.Image([sens_modis_full.select(band3).rename(x),
                    sens_land_full.select(band3).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var x = band6 + '-MOD09Q1'
var y = band6 + '-Landsat'
var img = ee.Image([sens_modis_full.select(band6).rename(x),
                    sens_land_full.select(band6).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var x = band12 + '-MOD09Q1'
var y = band12 + '-Landsat'
var img = ee.Image([sens_modis_full.select(band12).rename(x),
                    sens_land_full.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)


// delete me
print('Compare old')
var index = 'NDVI'
var band12 = 'Sens_' + index + '_ante12mo_p' + 10
var x = band12 + '-MOD09Q1'
var y = band12 + '-MODIS_old'
var img = ee.Image([sens_modis.select(band12).rename(x),
                    sens_modis_old.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

// delete me
var index = 'NDVI'
var band12 = 'Sens_' + index + '_ante12mo_p' + 10
var x = band12 + '-Landsat-2000_2012'
var y = band12 + '-Landsat-full'
var img = ee.Image([sens_land_full.select(band12).rename(x),
                    sens_land.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)

var index = 'NDVI'
var band12 = 'Sens_' + index + '_ante12mo_p' + 10
var x = band12 + '-MODIS-2000_2012'
var y = band12 + '-MODIS-full'
var img = ee.Image([sens_modis_full.select(band12).rename(x),
                    sens_modis.select(band12).rename(y)])
var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
var chart = ui.Chart.feature.byFeature(values, x, y)
  .setChartType('ScatterChart')
  .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
print(chart)
