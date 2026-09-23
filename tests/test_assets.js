/*
Testing: modules/assets.js
Alec L. Robitaille
*/



// Load modules
var assets = require('users/francisv/CFS:modules/assets.js');



// Variables
var dir = 'project/perfect-victor-232201/CFS/2026-09-22/2026-09-22_image_col';


// Test list_assets_in_dir
// Usage: list_assets_in_dir(dir);
print(assets.list_assets_in_dir(dir));



// Test delete_assets_in_dir
// Usage: delete_assets_in_dir(dir);
assets.delete_assets_in_dir(dir);


// Test collect_img_assets_in_dir
// Usage: assets.collect_img_assets_in_dir(dir);
var col = assets.collect_img_assets_in_dir(dir);
print(col);
