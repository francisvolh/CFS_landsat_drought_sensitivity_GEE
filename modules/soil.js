/*
Soil
Alec L. Robitaille


SoilGrids 2.0
https://samapriya.github.io/awesome-gee-community-datasets/projects/isric/
https://www.soilgrids.org/
https://data.isric.org/geonetwork/srv/eng/catalog.search#/metadata/178b79f1-7471-4dd4-b41e-aba8b18b1bfe

clay 	Proportion of clay particles (< 0.002 mm) in the fine earth fraction 	g/kg 	10 	g/100g (%) 	clay_mean
sand 	Proportion of sand particles (> 0.05 mm) in the fine earth fraction 	g/kg 	10 	g/100g (%) 	sand_mean
silt 	Proportion of silt particles (≥ 0.002 mm and ≤ 0.05 mm) in the fine earth fraction 	g/kg 	10 	g/100g (%) 	silt_mean

de Sousa, L., Poggio, L., Batjes, N.H., Heuvelink, G.B.M., Kempen, B., Ribeiro, E., Rossiter, D. SoilGrids 2.0: producing quality-assessed soil information for the globe. Under submission to SOIL


Sothe, C., Gonsamo, A., Arabian, J., Kurz, W. A., Finkelstein, S. A., & Snider, J. (2022).
Large soil carbon storage in terrestrial ecosystems of Canada.
Global Biogeochemical Cycles, 36, e2021GB007213. https://doi.org/10.1029/2021GB007213

https://samapriya.github.io/awesome-gee-community-datasets/projects/scs

*/


var soil_percent = function() {
	var silt = ee.Image("projects/soilgrids-isric/silt_mean");
	var sand = ee.Image("projects/soilgrids-isric/sand_mean");
	var clay = ee.Image("projects/soilgrids-isric/clay_mean");

	return ee.Image([silt, sand, clay])
    .select(['sand_0-5cm_mean', 'clay_0-5cm_mean', 'silt_0-5cm_mean'],
            ['sand_0_5cm_percent', 'clay_0_5cm_percent', 'silt_0_5cm_percent'])
    .reproject(ee.Projection('EPSG:4326'));
};
exports.soil_percent = soil_percent;



var soil_carbon = function() {
  console.log('warning: Sothe soil carbon data may be out of date');
  var sc = ee.ImageCollection("projects/sat-io/open-datasets/carbon_stocks_ca/sc")
    .toBands()
    .select(['sc_250m_v20_b1'], ['soil_carbon_250m_v20']);

  return sc;
};
exports.soil_carbon = soil_carbon;




var sampling_collection = ee.Image([
  soil_percent(),
  soil_carbon()
]);
exports.sampling_collection = sampling_collection;
