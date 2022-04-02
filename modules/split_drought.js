/*
Split vegetation indices into drought/non-drought
Alec L. Robitaille
*/


// Split vegetation indices into drought/non-drought pixels
var split_drought = function(images, percentile_masks, antecedent_list, percentile_list, index_list) {
  // Map over images
  return images.map(function(img) {
    // Get year
    var yr = img.get('year');

    // Filter percentile masks matching year
    var percent_mask = percentile_masks.filter(ee.Filter.eq('year', yr)).first();

    // Loop over antecedent_list
    return ee.Image(antecedent_list.map(function(antecedent_period) {
        // Loop over percentile_list
        return percentile_list.map(function(percentile) {
          // Loop over index_list
          return index_list.map(function(index) {
            // Set up band names
            var percent_mask_band = 'CMI_ante' + antecedent_period + '_lt_p' + percentile;
            var veg_band = index + '_ante' + antecedent_period + '_p' + percentile;
            var drought_veg_band = veg_band + '_drought';
            var base_veg_band = veg_band + '_base';

            // Set up lt mask
            var lt_mask = percent_mask.select(percent_mask_band);

            // Baseline vegetation index
            var baseline = img.select([index])
                              .updateMask(lt_mask.eq(0))
                              .rename([base_veg_band]);

            // Drought vegetation index
            var drought = img.select([index])
                             .updateMask(lt_mask.eq(1))
                             .rename([drought_veg_band]);
            return [baseline, drought];
          });
        });
      })
    );
  });
};
exports.split_drought = split_drought;





// Split vegetation indices into drought/non-drought pixels, with cap at percentile_high
var split_drought_cap = function(images, percentile_masks, antecedent_list, percentile_low, percentile_high, index_list) {
  // Map over images
  return images.map(function(img) {
    // Get year
    var yr = img.get('year');

    // Filter percentile masks matching year
    var percent_mask = percentile_masks.filter(ee.Filter.eq('year', yr)).first();

    // Loop over antecedent_list
    return ee.Image(antecedent_list.map(function(antecedent_period) {
        // Loop over index_list
        return index_list.map(function(index) {
          // Set up band names
          var percent_low_mask_band = 'CMI_ante' + antecedent_period + '_lt_p' + percentile_low;
          var percent_high_mask_band = 'CMI_ante' + antecedent_period + '_lt_p' + percentile_high;
          
          var veg_band = index + '_ante' + antecedent_period + '_p' + percentile_low;
          var drought_veg_band = veg_band + '_drought';
          var base_veg_band = veg_band + '_base';

          // Set up drought and base mask
          var lt_low_mask = percent_mask.select(percent_low_mask_band);
          var lt_high_mask = percent_mask.select(percent_high_mask_band);
          return([lt_low_mask, lt_high_mask])
          // Baseline vegetation index
          // var baseline = img.select([index])
          //                   .updateMask(lt_low_mask.not())
          //                   .updateMask(lt_high_mask)
          //                   // .updateMask(lt_low_mask.eq(0).or(lt_high_mask.eq(1)))
          //                   // .updateMask(lt_high_mask.eq(1))
          //                   .rename([base_veg_band]);

          // // Drought vegetation index
          // var drought = img.select([index])
          //                 .updateMask(lt_low_mask.eq(1))
          //                 .rename([drought_veg_band]);
          // return [baseline, drought];
        });
      })
    );
  });
};
exports.split_drought_cap = split_drought_cap;
 