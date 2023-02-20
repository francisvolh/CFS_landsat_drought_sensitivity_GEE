/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.MultiPoint(
        [[-122.87601510557185, 51.575257623159025],
         [-127.6908019425976, 59.8641849594477],
         [-127.96690934574258, 59.52208123280006],
         [-123.13207241108223, 54.67282444419289],
         [-106.98880981586618, 55.69926735189692],
         [-140.81354360387667, 63.45484619176337],
         [-139.76984243200167, 63.315807233524836],
         [-129.2204445293386, 65.44340868439454],
         [-127.61655341724074, 65.1980422796904],
         [-124.71727310440444, 63.99798235893234],
         [-123.30840051221965, 63.47596387072551]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
Map.addLayer(ee.Image.constant(1), {palette:'000', opacity:0.25}, 'constant');

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

var assetList = ee.data.listAssets("users/robitalec/CFS/2023-02-17")['assets']
                    .map(function(d) { return d.name });
var col = ee.ImageCollection(assetList);

print('Band names', col.first().bandNames());
col = col.select('Abs_sens_NDVI_ante12mo_p15_p85');

var palettes = require('users/gena/packages:palettes');

var p = palettes.crameri.vik[10];
var lc_p = palettes.crameri.bamako[25];

Map.addLayer(land_cover.land_cover().filter(ee.Filter.eq('year', 2000)), {palette:lc_p}, 'lc', false);
Map.addLayer(col, {palette: p, min: -0.2, max: 0.2}, 'absolute sensitivity');