// -- Load regions, land cover
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

// -- Load modules
// Load get_landsat module
var get_landsat = require('users/robitalec/CFS:modules/get_landsat.js');

// Load land cover module
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');

// Load fire module
var fire = require('users/robitalec/CFS:modules/fire.js');

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
var percentile_list = [5, 10];



// -- Loop over regions, export task for each
// Land cover
var lc = land_cover.get_land_cover();
lc = lc.map(fire.mask_five_year_fires);


// Daymet
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);



var sample = ecoregions.map(function(ft) {

	var indices_col = get_landsat.get_indices(min_year, max_year, '07-01', '07-31', ft, ['NDVI', 'EVI', 'NBR']);



})
