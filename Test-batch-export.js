var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

ecoregions = ecoregions.filter(ee.Filter.inList('ECOREGI', [137, 138, 172, 175, 193, 194]));

var agg_id = ecoregions.aggregate_array('ECOREGI')
print(agg_id)

Map.addLayer(ecoregions.filter(ee.Filter.eq('ECOREGI', 137)))

// Asynchronously pass the object's value to the callback function
agg_id.evaluate(
  function(ecoreg) {
    // Reducer for each element of the object
    ecoreg.forEach(
      // Export function
      function(ecoreg_id) {
        Export.table.toDrive(ecoregions.filter(ee.Filter.eq('ECOREGI', ecoreg_id)), ecoreg_id)
      })
  })