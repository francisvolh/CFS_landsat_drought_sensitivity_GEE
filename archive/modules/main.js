



// ARCHIVE --------------------------------------------------------------------
var zzz_main = function(output, region,
                    min_year, max_year, min_mm_dd, max_mm_dd,
                    index_list, percentile_list, antecedent_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);

  // Collections
  var monthly_daymet = daymet.monthly_daymet(years, months);
  var indices_col = landsat.indices(min_year, max_year, min_mm_dd, max_mm_dd, region.geometry(), index_list);

  // Mask land cover and fires
  indices_col = indices_col.map(land_cover.mask_land_cover_and_fire);

  // CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

  // Define drought
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  var percentile_images = percentile.percentile(ante_means, percentile_list);
  var lt_percent = percentile.lt_percentile(ante_means, percentile_images);

  // Split vegetation index into baseline/drought
  var split = split_drought.split_drought(indices_col, lt_percent, antecedent_list, percentile_list, index_list);

  if (output == 'relative sensitivity') {
    return sensitivity.sensitivity_relative(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'absolute sensitivity') {
    return sensitivity.sensitivity_absolute(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'vegetation index and antecedent means') {
    var join = ee.Join.inner();
    var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
    joined = ee.ImageCollection(joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))}));

    return joined;
  }

};
exports.zzz_main = zzz_main;



var zzz_main_cap = function(output, region,
                    min_year, max_year, min_mm_dd, max_mm_dd,
                    index_list, percentile_low, percentile_high, antecedent_list) {
  // Variables
  var years = ee.List.sequence(min_year, max_year);
  var months = ee.List.sequence(1, 12);
  var percentile_list = [percentile_low, percentile_high];

  // Collections
  var monthly_daymet = daymet.monthly_daymet(years, months);
  var indices_col = landsat.indices(min_year, max_year, min_mm_dd, max_mm_dd, region.geometry(), index_list);

  // Mask land cover and fires
  indices_col = indices_col.map(land_cover.mask_land_cover_and_fire);

  // CMI
  var cmi_daymet = monthly_daymet.map(cmi.calc_CMI);

  // Define drought
  var ante_means = antecedent.antecedent_means(cmi_daymet, 'CMI', years);
  var percentile_images = percentile.percentile(ante_means, percentile_list);
  var lt_percent = percentile.lt_percentile(ante_means, percentile_images);

  // Split vegetation index into baseline/drought
  var split = split_drought.split_drought_cap(indices_col, lt_percent, antecedent_list, percentile_low, percentile_high, index_list);

  percentile_list = [percentile_low];
  if (output == 'relative sensitivity') {
    return sensitivity.sensitivity_relative(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'absolute sensitivity') {
    return sensitivity.sensitivity_absolute(split, antecedent_list, percentile_list, index_list);
  } else if (output == 'vegetation index and antecedent means') {
    var join = ee.Join.inner();
    var joined = join.apply(indices_col, ante_means, ee.Filter.equals({leftField: 'year', rightField: 'year'}));
    joined = ee.ImageCollection(joined.map(function(img) {return ee.Image.cat(img.get('primary'), img.get('secondary'))}));
    return joined;
  }

};
exports.zzz_main_cap = zzz_main_cap;

