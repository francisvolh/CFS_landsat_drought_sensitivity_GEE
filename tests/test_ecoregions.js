/*
Testing: modules/ecoregions.js
Alec L. Robitaille
*/

// Load modules
var eco = require('users/robitalec/CFS:modules/ecoregions.js');



// Testing: ecoregions
var ecoregions = eco.ecoregions;


// Testing: get_eco_bands();
var ecoreg_bands = eco.get_eco_bands();


print('Ecoregions:', ecoregions);
print('Ecoregion, ecozone, ecoprovince as image bands:', ecoreg_bands);

Map.addLayer(ecoregions);
Map.addLayer(ecoreg_bands.select('ecoregion'), {min: 1, max: 217});
Map.addLayer(ecoreg_bands.select('ecoprovince'), {min: 1.1, max: 15.2});
Map.addLayer(ecoreg_bands.select('ecozone'), {min: 1, max: 15});