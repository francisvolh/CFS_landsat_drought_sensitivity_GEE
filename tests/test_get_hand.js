/*
Testing: modules/get_hand.js
Alec L. Robitaille
*/


// Load modules
var hand = require('users/robitalec/CFS:modules/get_hand.js');




// Test get_hand
// Usage: get_hand(resolution, threshold)
var hand_30_100 = hand.get_hand(30, 100);
print(hand_30_100);
Map.addLayer(hand_30_100.select('b1'), {min:0, max:100});
