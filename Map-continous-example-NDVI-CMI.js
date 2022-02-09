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
// Modules
var droughtModule = require('users/robitalec/CFS:modules/drought.js');
var ltgee = require('users/emaprlab/public:Modules/LandTrendr.js');
var palettes = require('users/gena/packages:palettes');



var drought = droughtModule.means;
var pal_cmi = palettes.colorbrewer.RdBu[5]
var viz_cmi = {"opacity":1,"bands":["CMI_ante12mo_mean"],"min":-10,"max":10,palette:pal_cmi}
Map.addLayer(drought.filter(ee.Filter.eq('year', 2018))
                    .select('CMI_ante12mo_mean'),
             viz_cmi, 'CMI')
             

// buildSRcollection(startYear, endYear, startDay, endDay, aoi, maskThese)
var col = ltgee.buildSRcollection(2018, 2019, '06-01', '07-31', geometry, ['cloud', 'shadow', 'snow', 'water']);

var pal = palettes.cmocean.Speed[7]

Map.addLayer(col.first().normalizedDifference(['B4', 'B3']), {min:0, max:1, palette:pal}, 'NDVI', false)




// Define a dictionary which will be used to make legend and visualize image on map
var dict = {
  "names": [-5, -2.5, 0, 2.5, 5],
  "colors": pal_cmi};

// Create a panel to hold the legend widget
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

// Function to generate the legend
function addCategoricalLegend(panel, dict, title) {

  // Create and add the legend title.
  var legendTitle = ui.Label({
    value: title,
    style: {
      fontWeight: 'bold',
      fontSize: '18px',
      margin: '0 0 4px 0',
      padding: '0'
    }
  });
  panel.add(legendTitle);

  var loading = ui.Label('Loading legend...', {margin: '2px 0 4px 0'});
  panel.add(loading);

  // Creates and styles 1 row of the legend.
  var makeRow = function(color, name) {
    // Create the label that is actually the colored box.
    var colorBox = ui.Label({
      style: {
        backgroundColor: color,
        // Use padding to give the box height and width.
        padding: '8px',
        margin: '0 0 4px 0'
      }
    });

    // Create the label filled with the description text.
    var description = ui.Label({
      value: name,
      style: {margin: '0 0 4px 6px'}
    });

    return ui.Panel({
      widgets: [colorBox, description],
      layout: ui.Panel.Layout.Flow('horizontal')
    });
  };

  // Get the list of palette colors and class names from the image.
  var palette = dict['colors'];
  var names = dict['names'];
  loading.style().set('shown', false);

  for (var i = 0; i < names.length; i++) {
    panel.add(makeRow(palette[i], names[i]));
  }

  Map.add(panel);

}


/*
  // Display map and legend ///////////////////////////////////////////////////////////////////////////////
*/

// Add the legend to the map
addCategoricalLegend(legend, dict, 'CMI');

