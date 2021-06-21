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
            })]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Data -------------------------------------------------------------------------
// Drought sensitivity 
var sens_80_19 = ee.Image('users/robitalec/CFS/drought-sensitivity-1980-2019');
var sens_00_19 = ee.Image('users/robitalec/CFS/drought-sensitivity-2000-2019');

// L5
var sens_l5 = ee.Image('users/robitalec/CFS/drought-sensitivity-Landsat-1980-2019');

// Load CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));

// Palette ----------------------------------------------------------------------
// Gena's palette functions
var palettes = require('users/gena/packages:palettes');

var pal = palettes.colorbrewer.RdBu[9].reverse();
var min = -20; var max = 20;
var viz = {min: min, max: max, palette: pal};

function showPalette(name, palette) {
  var image = ee.Image.pixelLonLat().select(0)
    .clip(ee.Geometry.Rectangle({coords: [[min, 0], [max, 10]], geodesic: false}))
    .visualize(viz);

  print(name);
  print(ui.Thumbnail(image));
}
// showPalette(min + '           0           ' + max, pal);


// Map --------------------------------------------------------------------------
Map.addLayer(ctef, null, 'ctef', false);

// Set either sens_80_19 or sens_00_19
var toview = sens_l5;

// Set the percentile to view
// either 5, 10, or 20
var p = 10;

// Filter the band names before map. Comment any of these out to just map all bands
var selectBands = toview.bandNames()
                        .filter(ee.Filter.stringContains('item', 'p' + p))
                        // .filter(ee.Filter.stringContains('item', 'NDVI'))
                        // .filter(ee.Filter.stringContains('item', 'ante3'))


// Note, there's a bit of server side logic here so the browser might hang briefly

// Get the list of band names and add them all separately to the map
// By default all are added, but not shown - so you'll need to select the one to view
// After you view one, make sure to set it off so you are only seeing one later at a time
// var bandList = selectBands.getInfo();
// for (var i = 0; i < bandList.length; i++) {
//   Map.addLayer(toview.select(bandList[i]), viz, bandList[i], false);
// }

var index = 'NDVI'
var ante = 3
Map.addLayer(sens_00_19.select('Sens_' + index + '_ante' + ante + '_p1'), viz, 'MODIS')
Map.addLayer(sens_l5.select('Sens_' + index + '_ante' + ante + 'mo_p1'), {min: max, max: min, palette: pal}, 'L5')

var index = 'EVI'
var ante = 3
// Map.addLayer(sens_00_19.select('Sens_' + index + '_ante' + ante + '_p1'), viz, 'MODIS')
// Map.addLayer(sens_l5.select('Sens_' + index + '_ante' + ante + 'mo_p1'), viz, 'L5')

var index = 'NBR'
var ante = 3
// Map.addLayer(sens_l5.select('Sens_' + index + '_ante' + ante + 'mo_p1'), viz, 'L5')


// Chart -------------------------------------------------------------------------
// Select an image to print a histogram
var band = 'Sens_EVI_ante3_p10';

// print(ui.Chart.image.histogram({
//   image: toview.select(band), 
//   region: ctef,
//   scale: 1e12,
//   maxBuckets: 7
// }));

// Export ------------------------------------------------------------------------ 
var exp = {
  image: toview.select(band).visualize(viz), 
  description: band,
  folder: 'Visuals',
  region: geometry2,
  scale: 5000,
  maxPixels: 2e9
};
// Export.image.toDrive(exp);

Map.setOptions('SATELLITE')