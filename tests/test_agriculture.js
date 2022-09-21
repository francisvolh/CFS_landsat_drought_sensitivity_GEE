/*
Testing: modules/agriculture.js
Alec L. Robitaille
*/



// Load modules
var agriculture = require('users/robitalec/CFS:modules/agriculture.js');
var land_cover = require('users/robitalec/CFS:modules/land_cover.js');



// Variables
var img = ee.Image.constant(1);
var lc_2015 = land_cover.hermosilla_1984_2019.aside(print).filter(ee.Filter.eq('year', 2015));
Map.addLayer(lc_2015, null, 'Land cover 2015', false);



// Test aafc_aci
// Usage: agriculture.aafc_aci;
var aafc_aci = agriculture.aafc_aci;
print('AAFC ACI', aafc_aci);
Map.addLayer(aafc_aci, null, 'AAFC ACI', false);



// Test masked_aci
// Usage: agriculture.masked_aci;
var masked_aci = agriculture.masked_aci;
print('Masked ACI', masked_aci);
Map.addLayer(masked_aci, null, 'Masked ACI', false);



// Test get_agriculture_mask
// Usage: agriculture.get_agriculture_mask
var ag_mask = agriculture.get_agriculture_mask;
print('Agriculture mask', ag_mask);
Map.addLayer(ag_mask, {palette: '#CD6600'}, 'Agriculture mask');
