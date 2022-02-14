/*
Split vegetation indices into drought/non-drought
Alec L. Robitaille
*/


// Split vegetation indices into drought/non-drought pixels
var split_drought = function(images, percentile_masks, antecedent_list, percentile_list, index_list) {
  // Map over images
  return images.map(function(img) {
    // Get year
    var yr = img.date().get('year');

    // Filter drought masks matching year
    var base = ee.Image(percentile_masks.filter(ee.Filter.eq('year', yr)))

    // Loop over antecedent_list
    return ee.Image(antecedent_list.map(function(antecedent_period) {
        // Loop over percentile_list
        return percentile_list.map(function(p) {
          // Loop over index_list
          return index_list.map(function(index) {
            // Set up band names
            var lt_band = 'CMI_lt_ante' + antecedent_period + '_p' + p;
            var id = index + '_ante' + antecedent_period + '_p' + p;
            var drought_band = id + '_drought';
            var base_band = id + '_base';

            // Set up drought and base mask
            var drought_mask = base.select(lt_band).eq(1);
            var baseline_mask = base.select(lt_band).eq(0);

            // Baseline vegetation index
            var baseline = img.select([index])
                           .updateMask(baseline_mask)
                           .rename([base_band]);

            // Drought vegetation index
            var drought = img.select([index])
                              .updateMask(drought_mask)
                              .rename([drought_band]);
            return [baseline, drought];
          });
        });
      })
    );
  });
};
exports.split_drought = split_drought;
