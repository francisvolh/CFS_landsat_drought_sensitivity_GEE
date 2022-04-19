// Load modules
var climate = require('users/robitalec/CFS:modules/get_long_term_climate.js');

// Set variables
var years = ee.List.sequence(1985, 2020);


// Load ecoregions
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');
ecoregions = ecoregions.filterBounds(geometry).limit(1);




// get_long_term_climate
var long_climate = climate.get_long_term_climate(years)
    .select(['tmean_mean', 'prcp_mean']);


var sample = long_climate.reduceRegions(ecoregions, ee.Reducer.mean(), 1000);


Export.table.toDrive(sample, 'ecoregion-long-term-climate');