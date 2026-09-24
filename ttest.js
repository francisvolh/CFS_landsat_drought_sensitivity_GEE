// Load modules
// var landsat = require('users/robitalec/CFS:modules/landsat.js');
var landsat = require('users/sang4gee/landsat:modules/landsat_ndwi.js')
// var mask = require('users/robitalec/CFS:modules/mask.js');
var mask = require('users/sang4gee/landsat:modules/mask.js');
var cmi_era5 = require('users/robitalec/CFS:modules/cmi_era5.js');
var climate = require('users/robitalec/CFS:modules/climate.js');
var percentile = require('users/robitalec/CFS:modules/percentile.js');
var antecedent = require('users/robitalec/CFS:modules/antecedent.js');
var split = require('users/robitalec/CFS:modules/split_drought.js');
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');
var vars = require('users/robitalec/CFS:modules/variables.js');
var nobs = require('users/robitalec/CFS:modules/nobs.js');


// var main_greenest = function(output, region) {
  // Variables
  var index_list = ['NDVI'];
	var antecedent_list = vars.ante_list;
	var min_year_climate =  vars.min_year_climate;
	var min_year_landsat =  vars.min_year_landsat;
	var max_year = vars.max_year;
  var min_month_climate = vars.min_month_climate;
  var max_month_climate = vars.max_month_climate;
  var years = ee.List.sequence(min_year_climate, max_year);
	var min_mm_dd = vars.min_mm_dd;
	var max_mm_dd = vars.max_mm_dd;
	var percentile_low = vars.percentile_low;
	var percentile_high = vars.percentile_high;
  var percentile_list = [percentile_low, percentile_high];
var output = 'relative sensitivity';


print(percentile_list)


  // Collections
  var indices_col = landsat.indices_greenest(min_year_landsat, max_year, min_mm_dd, max_mm_dd, region).select(index_list);

  // Apply mask
  indices_col = mask.apply_masks(indices_col);
print(indices_col.first())

  // CMI
  var monthly_era5 = climate.monthly_era5(min_year_climate, max_year, min_month_climate, max_month_climate);
  var cmi = monthly_era5.map(cmi_era5.calc_CMI_ERA5);
print(cmi.first())
  // Drought/baseline
  var ante_means = antecedent.antecedent_means(cmi, 'CMI', years);
  ante_means = ante_means.filter(ee.Filter.gte('year', min_year_landsat));

// print(ante_means.first());

  var percentile_images = percentile.percentile(ante_means, percentile_list);
  var percentile_masks = percentile.percentile_masks(ante_means, percentile_images);


print(percentile_images)  
print(percentile_masks.size())  



  var split_drought_wi = split.split_drought_wi(indices_col, percentile_masks, antecedent_list, index_list);

var split_drought_wi_3yr = split_drought_wi.select(['NDVI_ante3yr_lte_p15_drought', 'NDVI_ante3yr_wi_p15_p85_base']);
print(split_drought_wi_3yr.filterBounds(geometry).first())

var drought_ndvi_3yr = split_drought_wi.select('NDVI_ante3yr_lte_p15_drought').filterBounds(geometry);
var baseline_ndvi_3yr = split_drought_wi.select('NDVI_ante3yr_wi_p15_p85_base').filterBounds(geometry);

drought_ndvi_3yr = drought_ndvi_3yr.map(function(img) {return img.rename('NDVI');});
baseline_ndvi_3yr = baseline_ndvi_3yr.map(function(img){return img.rename('NDVI');});

var drought_3yr_mean = drought_ndvi_3yr.mean();
var baseline_3yr_mean = baseline_ndvi_3yr.mean();

var drought_3yr_std = drought_ndvi_3yr.reduce(ee.Reducer.stdDev());
var baseline_3yr_std = baseline_ndvi_3yr.reduce(ee.Reducer.stdDev());

// var std_img = drought_3yr_std.addBands(baseline_3yr_std);
// Export.image.toDrive({
//     image: std_img,
//     description:  'std_ndvi_na',
//     folder:'Exports',
//     region: region,
//     scale: 300,
//     maxPixels: 6000000000
// });




var n_drought = drought_ndvi_3yr.size();
var n_baseline = baseline_ndvi_3yr.size();

var var_drought = drought_3yr_std.multiply(drought_3yr_std);
var var_baseline = baseline_3yr_std.multiply(baseline_3yr_std);

var tStatistic = baseline_3yr_mean.subtract(drought_3yr_mean).divide(
    ee.ImageCollection([
        var_drought.divide(n_drought), 
        var_baseline.divide(n_baseline)
    ]).reduce(ee.Reducer.sum()).sqrt()
);

Map.centerObject(geometry);
Map.addLayer(tStatistic, {min: -3, max: 3, palette: ['blue', 'white', 'red']}, 't-statistic');

// Export.image.toDrive({
//     image: tStatistic,
//     description:  'ttest_ndvi_na',
//     folder:'Exports',
//     region: region,
//     scale: 300,
//     maxPixels: 6000000000
// });





var today = new Date().toJSON().slice(0, 10);
var asset_path = 't_test';
var scale = 900;

var eco = ee.FeatureCollection('projects/ee-sang4gee/assets/Ecoregions')

var ecoregions = eco.filter(ee.Filter.gt('ECOZONE', 3));
// var ecoregions = eco.non_arctic_ecoregions;

var output = 't_test NDVI';
var output_prefix = 't_test NDVI';
var asset_name = 't_test_ndvi'
  asset_name = today + '_' + asset_name;
  Export.image.toAsset({
    image: tStatistic,
    description: asset_name,
    assetId: asset_name,
    region: region,
    scale: scale,
    maxPixels: 1e13,
  });
  
  
  

// save in tiles


// var eco = ee.FeatureCollection('projects/ee-sang4gee/assets/Ecoregions')
// // Set variables
// var today = new Date().toJSON().slice(0, 10);
// var asset_path = 't_test';
// var scale = 300;


// var ecoregions = eco.filter(ee.Filter.gt('ECOZONE', 3));
// // var ecoregions = eco.non_arctic_ecoregions;

// var output = 't_test NDVI';
// var output_prefix = 't_test NDVI';

/*
// Get tiles
var tiler = require('users/gena/packages:tiler');
var tiles = tiler.getTilesForGeometry(ecoregions.geometry(), 6.3);


var export_img_asset = function(out, asset_name, asset_path, scale, region) {
  // var out = main.main_greenest(output, region);

  var today = new Date().toJSON().slice(0, 10);

  asset_name = today + '_' + asset_name;
  Export.image.toAsset({
    image: out,
    description: asset_name,
    assetId: asset_path + '/' + asset_name,
    region: region,
    scale: scale,
    maxPixels: 1e13,
  });
};



// loop regions
// asset_name = id
tiles = tiles.map(function(ft) {return ft.set('id', ft.get('system:index'))});
var tile_id_list = tiles.aggregate_array('id').distinct();
print(tile_id_list);

// Map.addLayer(tiles)
var sub_tile_id_list = tile_id_list.slice(0, 40);

sub_tile_id_list.evaluate(function(tile_ids) {
    tile_ids.forEach(function(tile_id) {
      var ft = tiles.filter(ee.Filter.eq('id', tile_id));
      export_img_asset(tStatistic, output_prefix + '_' + tile_id, asset_path, scale, ft);
    });
});
*/
