/*
Testing: modules/ecoregions.js
Alec L. Robitaille
*/

// Load modules
var eco = require('users/francisv/CFS:modules/ecoregions.js');



// Testing: ecoregions
var ecoregions = eco.ecoregions;


// Testing: non_arctic_ecoregions
var non_arctic_ecoregions = eco.non_arctic_ecoregions;


// Testing: eco_bands();
var ecoreg_bands = eco.eco_bands();


print('Ecoregions:', ecoregions);
print('Non arctic ecoregions:', non_arctic_ecoregions);
print('Ecoregion, ecozone, ecoprovince as image bands:', ecoreg_bands);

Map.addLayer(ecoregions, null, 'Ecoregions');
Map.addLayer(non_arctic_ecoregions, null, 'Non arctic ecoregions');
Map.addLayer(ecoreg_bands.select('ecoregion'), {min: 1, max: 217}, 'Ecoregion band');
Map.addLayer(ecoreg_bands.select('ecoprovince'), {min: 1.1, max: 15.2}, 'Ecoprovince band');
Map.addLayer(ecoreg_bands.select('ecozone'), {min: 1, max: 15}, 'Ecozone band');
