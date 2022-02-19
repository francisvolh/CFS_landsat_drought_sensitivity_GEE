/*
Exports
Alec L. Robitaille
*/

// Export task for each ecoregion
var export_by_ecoregion = function(ecoregions, geometry, output, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list) {
  var ecoreg_id_list = ecoregions
    .filterBounds(geometry)
    .aggregate_array('ECOREGI')
    .distinct();
    
  ecoreg_id_list.evaluate(function(ecoreg_ids) {
    ecoreg_ids.forEach(function(ecoreg_id) {
        var ft = ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id));
        
        var main_relative = main.main('relative sensitivity', ft, min_year, max_year, min_mm_dd, max_mm_dd, index_list, percentile_list);
        
        // var indices_col = get_landsat.get_indices(min_year, max_year, '07-01', '07-31', ft.geometry(), ['NDVI', 'EVI', 'NBR']);
        // var points = stratified.stratified_sample(lc, 'land_cover', ft.geometry(), 250);
        // var join = ee.Join.inner();
        // var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
        // joined = joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))});
        // var sampled = ee.ImageCollection(joined).map(function(img) {
        //   return img.reduceRegions(points, ee.Reducer.mean(), 30)
        // }).flatten();
      
        Export.table.toDrive(sampled, ecoreg_id, 'Batch-ecoregion-export');
      });
  });

};
exports.export_by_ecoregion = export_by_ecoregion;