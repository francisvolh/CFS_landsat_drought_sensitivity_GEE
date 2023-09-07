/*
Fire masks from NBAC fire data
Alec L. Robitaille

https://cwfis.cfs.nrcan.gc.ca/datamart
https://cwfis.cfs.nrcan.gc.ca/downloads/nbac/nbac_2020_r9_20210810.shp.pdf
*/

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



// Proportion five year fires
var prop_five_year_fires = function(yr, focal_dist) {
  var five_fires = five_year_fires(yr);
  return five_fires.focalMean(focal_dist, null, 'meters')
                   .rename('prop_five_year_fires_' + focal_dist);
};
exports.prop_five_year_fires = prop_five_year_fires;

