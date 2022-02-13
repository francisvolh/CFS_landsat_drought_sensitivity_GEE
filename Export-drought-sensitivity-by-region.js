/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-141.38652343750002, 67.51894613280258],
          [-141.38652343750002, 49.228143544359924],
          [-105.7908203125, 49.228143544359924],
          [-105.7908203125, 67.51894613280258]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// -- Load regions, land cover
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

// -- Load modules
// Load get_landsat module
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

// Load fire module
var fire = require('users/robitalec/CFS:modules/fire.js');

// Load stratified module
var stratified = require('users/robitalec/CFS:modules/stratified.js');

// Load CMI module
var cmi = require('users/robitalec/CFS:modules/cmi.js');

// Load get_daymet module
var get_daymet = require('users/robitalec/CFS:modules/get_daymet.js');

// Load percentile module
var percentile = require('users/robitalec/CFS:modules/percentile.js');

// Load antecedent module
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');



// -- Set variables
// Set years, months
var min_year = 1985;
var max_year = 2019;
var years = ee.List.sequence(min_year, max_year);
var min_month = 1;
var max_month = 12;
var months = ee.List.sequence(1, 12);

// Percentile list
var percentile_list = [10, 20, 30];



// -- Loop over regions, export task for each
// Land cover
var lc = land_cover.get_land_cover();
lc = lc.map(fire.mask_five_year_fires);
// TODO: fix this flex
lc = lc.filter(ee.Filter.eq('year', 2005)).first();

// Daymet
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);


// TODO: add modules - join collections, sample images

var eco_ids = ecoregions.filterBounds(geometry).limit(2).aggregate_array('ECOREGI')



// Asynchronously pass the object's value to the callback function
eco_ids.evaluate(
  function(ecoreg) {
    // Reducer for each element of the object
    ecoreg.forEach(
      // Export function
      function(ecoreg_id) {
        var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id))
        var indices_col = get_landsat.get_indices(min_year, max_year, '07-01', '07-31', ft.geometry(), ['NDVI', 'EVI', 'NBR']);
        var points = stratified.stratified_sample(lc, 'land_cover', ft.geometry(), 250);
        var join = ee.Join.inner();
        var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
        joined = joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))});
        var sampled = ee.ImageCollection(joined).map(function(img) {
          return img.reduceRegions(points, ee.Reducer.mean(), 30)
        }).flatten();
      
        Export.table.toDrive(sampled, ecoreg_id, 'Batch-ecoregion-export')
      })
  })
