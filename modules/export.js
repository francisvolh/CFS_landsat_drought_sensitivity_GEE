/*
Exports
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');


// Export task for each ecoregion
var export_by_ecoregion = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list) {
  var ecoreg_id_list = ecoregions
    .aggregate_array('ECOREGI')
    .distinct();
    
  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
        var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));
        
        var output = main.main(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);

        var points = stratified.stratified_sample(land_cover.lc_and_fire, 'land_cover', ft.geometry(), n_pts);
        
        var sampled = ee.ImageCollection(output).map(function(img) {
          return img.reduceRegions(points, ee.Reducer.mean(), 30);
        }).flatten();
      
        Export.table.toDrive(sampled, ecoreg_id, folder);
      });
  });

};
exports.export_by_ecoregion = export_by_ecoregion;