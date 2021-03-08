exports.maskBasline = function(veg, droughts, fires) {
  return veg.map(function(v) {
    var yr = v.date().get('year');
    
    var base = droughts.filter(ee.Filter.eq('year', yr))
                       .first();
                         
    var fire = fires.filter(ee.Filter.eq('year', yr))
                    .first()
                    .eq(0);
    
    var sumante = base.expression('ante3 + ante6 + ante12', {
                                    'ante3': base.select('CMI_gt_ante3_p10'),
                                    'ante6': base.select('CMI_gt_ante6_p10'),
                                    'ante12': base.select('CMI_gt_ante12_p10')})
                      .eq(3);
    
    return v.updateMask(fire).updateMask(sumante);
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
                    
                    
    var drought3 = base.select('CMI_gt_ante3_p10').eq(0)
    var drought6 = base.select('CMI_gt_ante6_p10').eq(0)
    var drought12 = base.select('CMI_gt_ante12_p10').eq(0)

    var veg3 = veg.updateMask(drought3).select(['NDVI', 'EVI'], ['NDVI_3', 'EVI_3']);
    var veg6 = veg.updateMask(drought6).select(['NDVI', 'EVI'], ['NDVI_6', 'EVI_6']);
    var veg12 = veg.updateMask(drought12).select(['NDVI', 'EVI'], ['NDVI_12', 'EVI_12']);
    
    return ee.Image([veg3, veg6, veg12]).copyProperties(v);
  });
};