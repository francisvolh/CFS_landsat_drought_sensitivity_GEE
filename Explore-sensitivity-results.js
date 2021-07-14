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
var sens_modis = ee.Image('users/robitalec/CFS/drought-sensitivity-1980-2019_v2');

// Landsat
var sens_land = ee.Image('users/robitalec/CFS/dr-sen-land-test-july-12');

// Load CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');


// Functions ---------------------------------------------------------------------
// Gena's palette functions
var palettes = require('users/gena/packages:palettes');

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

// Map --------------------------------------------------------------------------
// Compute terrain meaasures from the SRTM DEM.
var terrain = ee.Algorithms.Terrain(ee.Image("USGS/GMTED2010"));
var slope = radians(terrain.select('slope'));
var aspect = radians(terrain.select('aspect'));

var lcmask = lcmask.reverseMask();

// Set either sens_80_19 or sens_00_19
var toview = sens_modis;

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

// azimuth, zenith
var az = 120
var ze = 60
Map.addLayer(hillshade(az, ze, slope, aspect), {opacity:0.7}, az + ' deg')
Map.addLayer(ctef, null, 'ctef', false);



var band = 'Sens_NDVI_ante6mo_p10'
Map.addLayer(sens_modis.select(band), viz, 'MODIS')
Map.addLayer(sens_land.select(band), viz, 'Landsat')


Map.addLayer(sens_modis.select(band).subtract(sens_land.select(band)), 
             {min: -30, max: 30, palette: ["ff0000","ffffff","0014ff"]}, 
             'dif', false);

Map.addLayer(lcmask, null, 'lc', false);


// Summary stats -----------------------------------------------------------------
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
print(summary(sens_modis.select(band)))
print(summary(sens_land.select(band)))


// Chart -------------------------------------------------------------------------
// print(ui.Chart.image.histogram({
//   image: sens_modis.select(band), 
//   region: ctef,
//   scale: 1000
// }));

// print(ui.Chart.image.histogram({
//   image: sens_land.select(band), 
//   region: ctef,
//   scale: 1000
// }));

// Export ------------------------------------------------------------------------ 
// var exp = {
//   image: toview.select(band).visualize(viz), 
//   description: band,
//   folder: 'Visuals',
//   region: geometry2,
//   scale: 5000,
//   maxPixels: 2e9
// };
// Export.image.toDrive(exp);

// Map.setOptions('SATELLITE')