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
var region = 'Yukon';
print('Region selected: ' + region)

// Data -------------------------------------------------------------------------
// Drought sensitivity
var sens_modis = ee.Image('users/robitalec/CFS/drought-sensitivity-MOD09Q1-' + '2000_2012-2-' + region);
var sens_modis_absolute = ee.Image('users/robitalec/CFS/drought-sensitivity-MOD09Q1-' + '2000_2012-2-' + region + '_absolute');

// Landsat
var sens_land = ee.Image('users/robitalec/CFS/drought-sensitivity-Landsat-' + '2000_2012-' + region);
// var sens_land_absolute = ee.Image('users/robitalec/CFS/drought-sensitivity-Landsat-' + '2000_2012-' + region + '_absolute');

// Load CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');

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
var viz = {min: min, max: max, palette: pal, opacity:1};

var viz_abs = {min: -0.5, max: 0.5, palette: pal, opacity:1};

// Filter -----------------------------------------------------------------------
var toview = sens_land;

// Set the percentile to view
// either 5, 10, or 20
var p = 10;

// Filter the band names before map. Comment any of these out to just map all bands
var selectBands = toview.bandNames()
                        .filter(ee.Filter.stringContains('item', 'p' + p))

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


// Viz --------------------------------------------------------------------------
var vizgallery = {min: min, max: max, palette: pal, opacity:1};


// Map --------------------------------------------------------------------------
// Base layers:
// Constant image
Map.addLayer(ee.Image(1), {palette:'747474'}, 'constant', false);

// CTEF regions
Map.addLayer(ctef, null, 'ctef', false);

Map.addLayer(sens_modis.select(band), viz, 'MODIS relative ' + band, false);
Map.addLayer(sens_modis_absolute.select(band), viz_abs, 'MODIS absolute ' + band, false);
Map.addLayer(sens_land.select(band), viz, 'Landsat relative ' + band, false);
Map.addLayer(sens_land_absolute.select(band), viz_abs, 'Landsat absolute ' + band, false);

// Processed layers:
// MODIS/Landsat dif
// Map.addLayer(dif, {min: -30, max: 30, palette: ["ff0000","ffffff","0014ff"]}, 'dif', false);

// Land cover reverse mask
Map.addLayer(ee.Image('users/robitalec/CFS/land-cover-mask'), null, 'lc', false);

// Gallery ----------------------------------------------------------------------
// Across sensor gallery strip
var selectBands = toview.bandNames()
                        .filter(ee.Filter.stringEndsWith('item', '10'))
                        .filter(ee.Filter.stringContains('item', 'ante12mo'))
var comb = ee.Image([sens_modis.select(selectBands),
                     sens_modis_absolute.select(selectBands)])
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
Map.addLayer(acrosssensors, null, 'gallery: MODIS relative (top) MODIS absolute (bottom)', false);


// Across sensor gallery strip
// var selectBands = toview.bandNames()
//                         .filter(ee.Filter.stringEndsWith('item', '10'))
//                         .filter(ee.Filter.stringContains('item', 'ante12mo'))
// var comb = ee.Image([sens_land.select(selectBands),
//                     sens_land_absolute.select(selectBands)])
// var combcol = ee.ImageCollection.fromImages(comb.bandNames().map(function(name) {
//   return comb.select([name]).set({"name": ee.String(name)})
// }));
// var imagesRGB = combcol.map(function(img) {
//   var label = text.draw(img.get('name'), geolabel, Map.getScale(), {
//       fontSize:32, textColor: '000000', outlineColor: 'ffffff', outlineWidth: 1, outlineOpacity: 0.6});
//   return img.visualize(vizgallery).blend(label);
// });

// var rows = 2;
// var columns = 3;
// var acrosssensors = gallery.draw(ee.ImageCollection(imagesRGB), geometry.bounds(), rows, columns);
// Map.addLayer(acrosssensors, null, 'gallery: Landsat relative (top) Landsat absolute (bottom)', false);


// Charts -----------------------------------------------------------------------
// var index = 'NBR'
// print('Compare Landsat and MODIS: ' + index)
// var p = 10
// var band3 = 'Sens_' + index + '_ante3mo_p' + p
// var band6 = 'Sens_' + index + '_ante6mo_p' + p
// var band12 = 'Sens_' + index + '_ante12mo_p' + p
// var x = band3 + '-MOD09Q1'
// var y = band3 + '-Landsat'
// var img = ee.Image([sens_modis.select(band3).rename(x),
//                     sens_land.select(band3).rename(y)])
// var values = img.sample({region: ee.FeatureCollection.randomPoints(geometry, 1e3, 42).geometry(), scale: 30})
// var chart = ui.Chart.feature.byFeature(values, x, y)
//   .setChartType('ScatterChart')
//   .setOptions({titleX: x, titleY: y, trendlines: {0:{}}})
// print(chart)

