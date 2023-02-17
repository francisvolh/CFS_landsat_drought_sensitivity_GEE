/*
Anthropogenic
Alec L. Robitaille


Human footprint mask
Marconcini, M., Metz-Marconcini, A., Üreyen, S., Palacios-Lopez, D., Hanke, W.,
Bachofer, F., Zeidler, J., Esch, T., Gorelick, N., Kakarla, A., Paganini, M.,
Strano, E. (2020). Outlining where humans live, the World Settlement Footprint
2015. Scientific Data, 7(1), 1-14. doi:10.1038/s41597-020-00580-5

*/



var wsa = ee.Image("DLR/WSF/WSF2015/v1");
exports.world_settlement_area = wsa;
