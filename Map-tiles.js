Map.addLayer(ee.Image.constant(1), {palette:'000', opacity:0.5})

var assetList = ee.data.listAssets("users/robitalec/CFS/2022-07-10")['assets']
                    .map(function(d) { return d.name });
var col = ee.ImageCollection(assetList);

print('Band names', col.first().bandNames())
col = col.select('Abs_sens_NBR_ante12mo_p15_p85')  

var palettes = require('users/gena/packages:palettes');

var p = palettes.crameri.vik[10]


Map.addLayer(col, {palette: p, min: -0.4, max: 0.4})


// Notes
// Relationship between distance to climate station/consider daymet inaccuracies
// Haida Gwaii / 3 month NDVI
