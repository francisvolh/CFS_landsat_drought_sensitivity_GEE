/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-141.1072996524697, 64.71982943939068],
          [-141.1072996524697, 60.7694376851515],
          [-135.3065184024697, 60.7694376851515],
          [-135.3065184024697, 64.71982943939068]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var which = 'Landsat'
print(which)
var sens = ee.Image('users/robitalec/CFS/drought-sensitivity-' +  which + '-Yukon');
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

Map.addLayer(sens.select('Sens_NDVI_ante3mo_p10'))

var folder = 'aug-4-2021'

var exp = {
  image: lcmask.reverseMask(),
  description: 'lc-mask',
  folder: folder,
  region: geometry,
  scale: 300,
  maxPixels: 2e9
};
Export.image.toDrive(exp);

var a = 'Sens_NDVI_ante3mo_p10'
var exp = {
  image: sens.select(a),
  description: a  + '_' + which,
  folder: folder,
  region: geometry,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toDrive(exp);

var b = 'Sens_NDVI_ante12mo_p10'
var exp = {
  image: sens.select(b),
  description: b  + '_' + which,
  folder: folder,
  region: geometry,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toDrive(exp);

var c = 'Sens_EVI_ante3mo_p10'
var exp = {
  image: sens.select(c),
  description: c  + '_' + which,
  folder: folder,
  region: geometry,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toDrive(exp);

var d = 'Sens_EVI_ante12mo_p10'
var exp = {
  image: sens.select(d),
  description: d  + '_' + which,
  folder: folder,
  region: geometry,
  scale: 250,
  maxPixels: 2e9
};
Export.image.toDrive(exp);

