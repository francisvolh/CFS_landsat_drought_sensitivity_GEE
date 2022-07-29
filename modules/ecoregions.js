/*
Variables
Alec L. Robitaille
*/


var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
exports.ecoregions = ecoregions;


var get_eco_bands = function() {
	return ee.Image([
    ecoregions.reduceToImage(['ECOPROV'], ee.Reducer.first()).rename('ECOPROV'),
    ecoregions.reduceToImage(['ECOREGI'], ee.Reducer.first()).rename('ECOREGI'),
    ecoregions.reduceToImage(['ECOZONE'], ee.Reducer.first()).rename('ECOZONE'),
  ]);
}
exports.get_eco_bands = get_eco_bands;
