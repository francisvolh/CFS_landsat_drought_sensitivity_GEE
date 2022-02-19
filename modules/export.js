/*
Export by
Alec L. Robitaille
*/

var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var main = require('users/robitalec/CFS:modules/main.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');


// Export task for each ecoregion
var export_by_ecoregion = function(output, folder, n_pts, ecoregions, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list) {
  var ecoreg_id_list = ecoregions
    .aggregate_array('ECOREGI')
    .distinct();

  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
      var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));
    
      var output = main.main(output, ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
      var lc_2002 = land_cover.lc_and_fire.filter(ee.Filter.eq('year', 2002)).first();
      var points = stratified.stratified_sample(lc_2002, 'land_cover', ft.geometry(), n_pts);
      
      if (output == )      

      
      if (output == 'relative sensitivity' | output == 'absolute sensitivity') {
        var sampled = output.reduceRegions(points, ee.Reducer.mean(), 30);
        return sampled;
      } else if (output == 'vegetation index and antecedent means') {
        var sampled = output.map(function(img) {
          return img.reduceRegions(points, ee.Reducer.mean(), 30);
        }).flatten();
        return sampled''
      } 
  
    
      var today = new Date().toJSON().slice(0, 10);
      Export.table.toDrive(sampled, today + ecoreg_id, folder);
    });
  });
};
exports.export_by_ecoregion = export_by_ecoregion;