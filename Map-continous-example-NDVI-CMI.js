/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var viz_cmi = {"opacity":1,"bands":["CMI_ante12mo_mean"],"min":-0.5,"max":15,"gamma":1},
    geometry = 
    /* color: #d63000 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-169.42363281250002, 71.30949017069483],
          [-169.42363281250002, 48.76683332204826],
          [-92.07988281250002, 48.76683332204826],
          [-92.07988281250002, 71.30949017069483]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Drought module
var droughtModule = require('users/robitalec/CFS:modules/drought.js');

var drought = droughtModule.means;

Map.addLayer(drought.filter(ee.Filter.eq('year', 2018))
                    .select('CMI_ante12mo_mean'),
             viz_cmi)
             
             
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js');
var palettes = require('users/gena/packages:palettes');

// buildSRcollection(startYear, endYear, startDay, endDay, aoi, maskThese)
var col = ltgee.buildSRcollection(2018, 2019, '06-01', '07-31', geometry, ['cloud', 'shadow', 'snow', 'water']);

var pal = palettes.cmocean.Speed[7]

Map.addLayer(col.first().normalizedDifference(['B4', 'B3']), {min:0, max:1, palette:pal})
