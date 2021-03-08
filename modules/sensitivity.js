exports.maskVeg = function(veg, droughts, fires, percentiles) {
  return veg.map(function(v) {
    var yr = v.date().get('year');
    
    var base = droughts.filter(ee.Filter.eq('year', yr))
                       .first();
    // SWITCH var base = ee.Image(droughts.filter(ee.Filter.eq('year', yr)))
    var fire = fires.filter(ee.Filter.eq('year', yr))
                    .first()
                    .eq(0);
                    
    return ee.Image(
      percentiles.map(function(percent) {
        
        var ante3band = 'CMI_gt_ante3_p' + percent;
        var ante6band = 'CMI_gt_ante6_p' + percent;
        var ante12band = 'CMI_gt_ante12_p' + percent;
        
        var ndviband = 'NDVI_base_p' + percent;
        var eviband = 'EVI_base_p' + percent;
        
        var drought3band = 'CMI_gt_ante3_p' + percent;
        var drought6band = 'CMI_gt_ante6_p' + percent;
        var drought12band = 'CMI_gt_ante12_p' + percent;
        
        var ante3ndvi = 'NDVI_ante3_p' + percent;
        var ante6ndvi = 'NDVI_ante6_p' + percent;
        var ante12ndvi = 'NDVI_ante12_p' + percent;
        var ante3evi = 'EVI_ante3_p' + percent;
        var ante6evi = 'EVI_ante6_p' + percent;
        var ante12evi = 'EVI_ante12_p' + percent;

        var drought3 = base.select(drought3band).eq(0);
        var drought6 = base.select(drought6band).eq(0);
        var drought12 = base.select(drought12band).eq(0);

        var veg3 = v.updateMask(drought3).select(['NDVI', 'EVI'], [ante3ndvi, ante3evi]);
        var veg6 = v.updateMask(drought6).select(['NDVI', 'EVI'], [ante6ndvi, ante6evi]);
        var veg12 = v.updateMask(drought12).select(['NDVI', 'EVI'], [ante12ndvi, ante12evi]);
        
        var basemask = base.expression('ante3 + ante6 + ante12', {
          'ante3': base.select(ante3band),
          'ante6': base.select(ante6band),
          'ante12': base.select(ante12band)
        }).eq(3);
        
        var baseveg = v.updateMask(fire)
                       .updateMask(basemask)
                       .select(['NDVI', 'EVI'], [ndviband, eviband]);
               
       return ee.Image([base
      // , veg3, veg6, veg12
       ]).copyProperties(v);
      })
    );
  });
};


exports.maskDrought = function(veg, droughts, fires) {
  return veg.map(function(v) {
    var yr = v.date().get('year');
    
    var base = droughts.filter(ee.Filter.eq('year', yr))
                       .first();
                         
    var fire = fires.filter(ee.Filter.eq('year', yr))
                    .first()
                    .eq(0);
                    
    var drought3 = base.select('CMI_gt_ante3_p10').eq(0);
    var drought6 = base.select('CMI_gt_ante6_p10').eq(0);
    var drought12 = base.select('CMI_gt_ante12_p10').eq(0);

    var veg3 = v.updateMask(drought3).select(['NDVI', 'EVI'], ['NDVI_3', 'EVI_3']);
    var veg6 = v.updateMask(drought6).select(['NDVI', 'EVI'], ['NDVI_6', 'EVI_6']);
    var veg12 = v.updateMask(drought12).select(['NDVI', 'EVI'], ['NDVI_12', 'EVI_12']);
    
    return ee.Image([veg3, veg6, veg12]).copyProperties(v);
  });
};