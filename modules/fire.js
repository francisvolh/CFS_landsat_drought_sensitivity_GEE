/*
Fire masks from NBAC fire data
Alec L. Robitaille

https://cwfis.cfs.nrcan.gc.ca/datamart
https://cwfis.cfs.nrcan.gc.ca/downloads/nbac/nbac_2020_r9_20210810.shp.pdf
*/

// Load modules
var vars = require('users/robitalec/CFS:modules/variables.js');


// Load NBAC fire polygons
var NBAC_fires = ee.FeatureCollection("users/robitalec/CFS/nbac_combined_1986_to_2020_20210810_and_2021_20220624");


// Generate fire masks from NBAC - any fire in preceeding 5 years
var five_year_fires = function(yr) {
  var date = ee.Date.fromYMD(yr, 1, 1);

  // Present year
  var y = date.get('year');

  // 5 years previous
  var ymin5 = date.advance(-4, 'year').get('year');

  // Filter fires within last 5 years
  // Reduce to any non zero = anywhere there is a fire
  // Result is 0 = no fire, 1 = fire
  return ee.Image([
    NBAC_fires.filter(ee.Filter.rangeContains('YEAR', ymin5, y))
							.reduceToImage(['YEAR'], ee.Reducer.anyNonZero())
							.rename('fire-in-last-5-years')
    ]).set('year', yr); 
};
exports.five_year_fires = five_year_fires;


// Mask fires
var mask_five_year_fires = function(img) {
  var yr = img.get('year');
  
  var fire = five_year_fires(yr).eq(0);
  return(img.updateMask(fire));
};
exports.mask_five_year_fires = mask_five_year_fires;



// Sum of burned buffer
var sum_burned_buffer = function(focal_dist) {
  var year_list  = ee.List.sequence(vars.min_year_landsat, vars.max_year);
  
  var five_fires = ee.ImageCollection(year_list.map(function(yr) {
    return five_year_fires(yr)
              .focalMean(focal_dist, null, 'meters');
  }));
  
  return five_fires.reduce(ee.Reducer.sum())
                   .rename('sum_burned_' + focal_dist + '_m')
                   .divide(year_list.length());
};
exports.sum_burned_buffer = sum_burned_buffer;