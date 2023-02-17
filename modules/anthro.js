/*
Anthropogenic
Alec L. Robitaille


Human footprint mask
Marconcini, M., Metz-Marconcini, A., Üreyen, S., Palacios-Lopez, D., Hanke, W.,
Bachofer, F., Zeidler, J., Esch, T., Gorelick, N., Kakarla, A., Paganini, M.,
Strano, E. (2020). Outlining where humans live, the World Settlement Footprint
2015. Scientific Data, 7(1), 1-14. doi:10.1038/s41597-020-00580-5


Canada Landsat Derived Forest harvest disturbance 1985-2020
Hermosilla, T., Wulder, M.A., White, J.C., Coops, N.C., Hobart, G.W., Campbell, 
L.B., 2016. Mass data processing of time series Landsat imagery: pixels to 
data products for forest monitoring. International Journal of Digital Earth 
9(11), 1035-1054.

*/



var world_settlement_area = ee.Image("DLR/WSF/WSF2015/v1");
exports.world_settlement_area = world_settlement_area;


var harvest = ee.Image("projects/sat-io/open-datasets/CA_FOREST/CA_Forest_Harvest_1985-2020");
exports.harvest = harvest;
