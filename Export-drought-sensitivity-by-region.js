/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #d63000 */ee.Geometry.MultiPoint(
        [[-139.97579543960364, 65.83413123764356],
         [-138.56954543960364, 64.69425597472363],
         [-136.19649856460364, 65.43528524775013],
         [-133.51583450210364, 62.89004755820581],
         [-139.66817825210364, 63.543497756055004],
         [-139.14083450210364, 61.93361258681364],
         [-129.73653762710364, 61.621894234470766],
         [-131.80196731460364, 61.28589861142703],
         [-118.61837356460364, 61.11653910886763],
         [-127.05587356460364, 63.77747307569574],
         [-119.58517043960364, 62.648750882076556],
         [-131.93380325210364, 59.17011393774116],
         [-117.12423293960364, 59.12504112353116],
         [-125.34200637710364, 58.92147788456891],
         [-110.57638137710364, 58.602423108356845],
         [-109.87325637710364, 57.745021175866],
         [-111.63106887710364, 60.92491895056844],
         [-113.43282668960364, 59.21512742031878],
         [-111.54317825210364, 58.21104838449295],
         [-115.98165481460364, 58.46478702520315],
         [-119.98067825210364, 58.14153033751206],
         [-113.82833450210364, 57.58047653103849],
         [-111.32345168960364, 57.27290910596848],
         [-115.27852981460364, 57.130081886529744],
         [-119.80489700210364, 56.79466520012462],
         [-122.26583450210364, 56.31024357158377],
         [-118.88204543960364, 55.29767874555168],
         [-111.67501418960364, 55.29767874555168],
         [-112.50997512710364, 56.553229424590555],
         [-115.54220168960364, 55.59676795547254],
         [-118.70626418960364, 54.463443500034664],
         [-122.70528762710364, 54.30990441022726],
         [-124.46310012710364, 54.15579037600694],
         [-130.00020950210364, 57.41518445274881],
         [-126.66036575210364, 56.212613962103276],
         [-127.89083450210364, 55.19747796360275],
         [-124.99044387710364, 53.76798315646577],
         [-119.80489700210364, 52.12652294882875],
         [-126.96798293960364, 52.234307918134455],
         [-125.47384231460364, 51.0342593477276],
         [-127.14376418960364, 50.08511350877288],
         [-123.97970168960364, 48.65444814056177],
         [-109.91720168960364, 52.68948431875474],
         [-114.70724075210364, 54.463443500034664],
         [-105.43477981460364, 58.83061815832015],
         [-103.41329543960364, 56.065702087489704],
         [-107.98360793960364, 56.43193060665867],
         [-108.33517043960364, 60.2559884417488],
         [-124.99044387710364, 62.180719243674474],
         [-131.58224075210364, 65.28872501028987],
         [-137.51485793960364, 60.470617014664086],
         [-130.48360793960364, 55.39454987058114],
         [-116.94845168960364, 49.96870574653958]]);
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

// Load VHI module
var vhi = require('users/robitalec/CFS:modules/vhi.js');


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

var eco_ids = ecoregions.filterBounds(geometry).aggregate_array('ECOREGI')



// Asynchronously pass the object's value to the callback function
eco_ids.evaluate(
  function(ecoreg) {
    // Reducer for each element of the object
    ecoreg.forEach(
      // Export function
      function(ecoreg_id) {
        var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));
        var indices_col = get_landsat.get_indices(min_year, max_year, '07-01', '07-31', ft.geometry(), ['NDVI', 'EVI', 'NBR']);
        indices_col = vhi.calc_vci(indices_col);
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
