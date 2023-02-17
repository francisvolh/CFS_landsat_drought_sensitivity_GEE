// Test lc_count_mask
// Usage: lc_count_mask()
var lc_count_mask = land_cover.lc_count_mask();
Map.addLayer(lc_count_mask, null, 'land_cover.lc_count_mask()', false);



// Test lc_transitions
// Usage: lc_transitions()
var lc_transitions = land_cover.lc_transitions();
Map.addLayer(lc_transitions, null, 'land_cover.lc_transitions()', false);



// Mask with lc_transitions()
img = img.updateMask(lc_transitions);
Map.addLayer(img, {palette: '#ff3939'}, 'mask with lc_count_mask() and lc_transitions()');



// Test mask_land_cover_and_fire
// Usage: mask_land_cover_and_fire(img)
var indices_masked_lc_and_fire = indices_green_col.map(land_cover.zzz_mask_land_cover_and_fire);
// print(indices_masked_lc_and_fire);
// Map.addLayer(indices_masked_lc_and_fire.select('NDVI'), null, 'land_cover.zzz_mask_land_cover_and_fire(img)', false);



// Test mask_heterogeneous
// Usage: mask_heterogeneous(img)
var mask_hetero_lc = land_cover.mask_heterogeneous(lc_2008);
// Map.addLayer(lc_2008, {palette:'#abffbd'}, 'constant (lc)', false);
// Map.addLayer(mask_hetero_lc, {palette:'#000000'}, 'land_cover.mask_heterogeneous(img)', false);



// Test homogeneous_land_cover
// Usage: homogeneous_land_cover()
// var lc_homogeneous = land_cover.homogeneous_land_cover();
// print(lc_homogeneous);

