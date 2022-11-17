/*
Testing: modules/assets.js
Alec L. Robitaille
*/



// Load modules
var assets = require('users/robitalec/CFS:modules/assets.js');



// Variables
var dir = 'users/robitalec/CFS/2022-07-28';



// Test list_assets_in_dir();
// Usage: list_assets_in_dir(dir);
print(assets.list_assets_in_dir(dir));



// Test delete_assets_in_dir();
// Usage: delete_assets_in_dir(dir);
assets.delete_assets_in_dir(dir);