exports.maskVeg = function(veg, droughts, fires, percentiles) {
  return veg.map(function(v) {
    var yr = v.date().get('year');
    
    var base = droughts.filter(ee.Filter.eq('year', yr))
                       .first();
    // SWITCH var base = ee.Image(droughts.filter(ee.Filter.eq('year', yr)))
    var fire = fires.filter(ee.Filter.eq('year', yr))
                    .first()
                    .eq(0);
                    
    v = v.updateMask(fire);
                    
    return ee.Image(
      percentiles.map(function(percent) {
        var ante3band = 'CMI_gt_ante3_p' + percent;
        var ante6band = 'CMI_gt_ante6_p' + percent;
        var ante12band = 'CMI_gt_ante12_p' + percent;
        
        var drought3 = base.select(ante3band).eq(0);
        var drought6 = base.select(ante6band).eq(0);
        var drought12 = base.select(ante12band).eq(0);

        var ante3ndvi = 'NDVI_ante3_p' + percent;
        var ante6ndvi = 'NDVI_ante6_p' + percent;
        var ante12ndvi = 'NDVI_ante12_p' + percent;
        var ante3evi = 'EVI_ante3_p' + percent;
        var ante6evi = 'EVI_ante6_p' + percent;
        var ante12evi = 'EVI_ante12_p' + percent;
        
        var veg3 = v.updateMask(drought3)
                    .select(['NDVI', 'EVI'], [ante3ndvi, ante3evi]);
        var veg6 = v.updateMask(drought6)
                    .select(['NDVI', 'EVI'], [ante6ndvi, ante6evi]);
        var veg12 = v.updateMask(drought12)
                     .select(['NDVI', 'EVI'], [ante12ndvi, ante12evi]);
        

        
        var basemask = base.expression('ante3 + ante6 + ante12', {
          'ante3': base.select(ante3band),
          'ante6': base.select(ante6band),
          'ante12': base.select(ante12band)
        }).eq(3);
        
        var ndviband = 'NDVI_base_p' + percent;
        var eviband = 'EVI_base_p' + percent;
        
        var baseveg = v.updateMask(basemask)
                       .select(['NDVI', 'EVI'], [ndviband, eviband]);
               
       return ee.Image([baseveg, veg3, veg6, veg12]).copyProperties(v);
      })
    );
  });
};