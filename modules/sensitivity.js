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
    
    var sumante = base.expression('ante3 + ante6 + ante12', {
                                    'ante3': base.select('CMI_gt_ante3_p10'),
                                    'ante6': base.select('CMI_gt_ante6_p10'),
                                    'ante12': base.select('CMI_gt_ante12_p10')})
                      .eq(3);
    
    return v.updateMask(fire).updateMask(sumante);
  });
};