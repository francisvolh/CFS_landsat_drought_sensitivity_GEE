// Get HAND
var geometry = 
    ee.Geometry.Polygon(
        [[[-168.54997439051382, 71.83257848283961],
          [-168.54997439051382, 38.21307697867719],
          [-79.25309939051384, 38.21307697867719],
          [-79.25309939051384, 71.83257848283961]]], null, false);


var get_hand = function(resolution, threshold) {
  if (resolution == 30 & threshold == 100) {
    // Note: image collection vs image
    return ee.ImageCollection("users/gena/global-hand/hand-100").select(['b1'], ['hand_30_100'])
        .filterBounds(geometry).mosaic();
  } else if (resolution == 30 & threshold == 1000) {
    return ee.Image("users/gena/GlobalHAND/30m/hand-1000").select(['b1'], ['hand_30_1000']);
  } else if (resolution == 90 & threshold == 1000) {
    return ee.Image("users/gena/GlobalHAND/90m-global/hand-1000").select(['b1'], ['hand_90_1000']);
  }
};
exports.get_hand = get_hand;


