/*
Ecoregions
Alec L. Robitaille
*/


var ecoregions = ee.FeatureCollection('projects/perfect-victor-232201/assets/Landsat_ms/ecozones');
exports.ecoregions = ecoregions;



var non_arctic_ecoregions = ecoregions.filter(ee.Filter.gt('ECOZONE', 3));
exports.non_arctic_ecoregions = non_arctic_ecoregions;



var eco_bands = function() {
	return ee.Image([
    ecoregions.reduceToImage(['ECOPROV'], ee.Reducer.first()).rename('ecoprovince'),
    ecoregions.reduceToImage(['ECOREGI'], ee.Reducer.first()).rename('ecoregion'),
    ecoregions.reduceToImage(['ECOZONE'], ee.Reducer.first()).rename('ecozone')
  ]);
};
exports.eco_bands = eco_bands;