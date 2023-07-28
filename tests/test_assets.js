/*
Testing: modules/assets.js
Alec L. Robitaille
*/



// Load modules
var assets = require('users/robitalec/CFS:modules/assets.js');



// Variables
var dir = 'users/robitalec/CFS/2023-07-19';



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
