var main = function(output, region, 
                    min_year, max_year, min_mm_dd, max_mm_dd, 
                    index_list, percentile_list) {
  // Get Daymet
  var monthly_daymet = get_daymet.get_monthly_daymet(years, months);
  
  // Get Landsat indices
  var indices_col = get_landsat.get_indices(min_year, max_year, min_mm_dd, max_mm_dd, region.geometry(), percentile_list);

  
  // Calculate CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
  
  // Antecedent means
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  
  // Percentile
  var percentile_images = percentile.get_percentile(ante_means, percentile_list);
  var lt_percent = percentile.lt_percentile(ante_means, percentile_images);

  

}



// VEGETATION
// get indices: min_year, max_year, min_mm_dd, max_mm_dd, region, indices)

// SAMPLING
// stratified sample: N points

// CMI
// year list
// percentile list

// RETURN
// either antecedent means, or drought sensitivity

// Daymet
var monthly_daymet = get_daymet.get_monthly_daymet(years, months);

// Calculate CMI
var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);
var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
var percentile_images = percentile.get_percentile(ante_means, percentile_list);
var lt_percent = percentile.lt_percentile(ante_means, percentile_images);
// drought calc


var points = stratified.stratified_sample(lc, 'land_cover', ft.geometry(), 250);
var join = ee.Join.inner();
var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
joined = joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))});
var sampled = ee.ImageCollection(joined).map(function(img) {
  return img.reduceRegions(points, ee.Reducer.mean(), 30)
}).flatten();