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
var viz = {min: 0, max: 300};
Map.addLayer(ecoreg_bands.select('ecoregion'), viz);
Map.addLayer(ecoreg_bands.select('ecozone'), viz);
Map.addLayer(ecoreg_bands.select('ecoprovince'), viz);