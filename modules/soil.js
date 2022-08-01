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


*/


var get_soil_percent = function() {
	var silt = ee.Image("projects/soilgrids-isric/silt_mean");
	var sand = ee.Image("projects/soilgrids-isric/sand_mean");
	var clay = ee.Image("projects/soilgrids-isric/clay_mean");

	return ee.Image([silt, sand, clay])
    .multiply(0.1)
    .select(['sand_0-5cm_mean', 'clay_0-5cm_mean', 'silt_0-5cm_mean'],
            ['sand_0-5cm_percent', 'clay_0-5cm_percent', 'silt_0-5cm_percent']);
};
exports.get_soil_percent = get_soil_percent;




// TODO: Hugelius peat
// TODO: Sothe soil carbon stock
