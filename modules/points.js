/*
Build sampling collection
Alec L. Robitaille

*/


var land_cover = require('users/robitalec/CFS:modules/land_cover.js');
var stratified = require('users/robitalec/CFS:modules/stratified.js');

var geometry = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-141.4430528814123, 68.27919277463084],
          [-141.13300806589254, 64.04137893026935],
          [-139.73426050644431, 60.04815657459371],
          [-126.34684688322079, 49.10211106287488],
          [-108.90484061318891, 49.055202844054236],
          [-91.79138600476233, 48.67346079998252],
          [-95.41638550817073, 59.939877470328504],
          [-99.80739862269407, 62.42033801780019],
          [-108.28910573882132, 65.53581583394379],
          [-128.65907556424258, 68.27919277463084]]]);
          
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada')
  .filterBounds(geometry);

var n_pts = 500;

var lc_modal = land_cover.lc_and_fire.reduce(ee.Reducer.mode());
lc_modal = lc_modal.reproject(land_cover.lc_and_fire.first().projection());

var lc_focal_mean = land_cover.get_lc_focal_mean();
print(lc_focal_mean)

var points = ecoregions.map(function(ft) {
  return stratified.stratified_sample(lc_modal, 'land_cover_mode', 3000, ft.geometry(), n_pts)
    // .map(function(f) {
    //   return f
      .set({ecoprovince: ft.get('ECOPROV'),
                    ecoregion: ft.get('ECOREGI'),
                    ecozone: ft.get('ECOZONE'),
                    sampling_collection: new Date().toJSON().slice(0, 10)
      // });
    });
}).flatten();

var today = new Date().toJSON().slice(0, 10);
Export.table.toAsset(points, today + '_sampling_points', 'CFS/' + today + '_sampling_points');