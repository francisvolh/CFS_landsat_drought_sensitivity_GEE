/*
Number of observations
Alec L. Robitaille
*/

var count_nobs = function(split_indices, sensitivity) {
  var count = split_indices
    .reduce(ee.Reducer.count())

  return sensitivity.addBands(count);
}
