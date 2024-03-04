/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #98ff00 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-140.34883237651985, 69.26353709558191],
          [-140.52461362651985, 60.64033182160344],
          [-137.55830503276985, 59.01736859747062],
          [-135.27314878276985, 59.83321707575103],
          [-130.04365659526985, 55.94857792504953],
          [-129.60420347026985, 55.05256637291083],
          [-130.15351987651985, 54.13604576362095],
          [-127.55977674554609, 51.12194703686519],
          [-128.2848744017961, 50.69243111462421],
          [-123.56075330804609, 48.397635766757624],
          [-122.92354627679609, 49.1649782419344],
          [-94.96194709738704, 49.2637797501458],
          [-87.13968147238704, 48.97616877622111],
          [-78.02599186305702, 44.152697809186904],
          [-71.87364811305702, 44.96678655916733],
          [-61.37331512701491, 45.21498356187747],
          [-52.80397918951491, 47.30152148795598],
          [-56.49538543951491, 49.63200174740368],
          [-56.45144012701491, 50.979123914012334],
          [-55.83620575201491, 52.476032434784074],
          [-62.839015122518916, 56.40203556323465],
          [-63.33056662011073, 57.88531005716525],
          [-64.7726088725189, 60.229164035092765],
          [-66.3985854350189, 57.926796690576545],
          [-67.8048354350189, 58.043282556729864],
          [-73.3419448100189, 61.86675936551736],
          [-77.0772963725189, 61.238784589777055],
          [-76.8575698100189, 58.32130619780787],
          [-76.19839012251892, 56.01096062557565],
          [-78.17838478664324, 54.59065766049851],
          [-77.55851886502215, 53.41941699015472],
          [-79.7579604350189, 51.13833163836276],
          [-81.93845383642366, 52.51383493833268],
          [-83.44936668501887, 54.02098867908457],
          [-85.26098928890707, 54.98702378609727],
          [-92.15053856001889, 56.69273057848732],
          [-96.32045867160187, 60.43097756759731],
          [-90.43178679660187, 64.27874498929553],
          [-102.95620085910187, 67.3362965182384],
          [-113.81069304660187, 67.38704184569805],
          [-126.55483367160187, 69.36157082221848],
          [-137.14565398410187, 68.58910975892182]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Climate source comparison app
Alec L. Robitaille
 
*/



// Modules
var climate = require('users/robitalec/CFS:modules/climate.js');
var cmi = require('users/robitalec/CFS:modules/cmi.js');
var cmi_era5 = require('users/robitalec/CFS:modules/cmi_era5.js');
var palettes = require('users/gena/packages:palettes');



// Variables
var month_list = ee.List.sequence(5, 10);
var geometry = ee.Geometry.Polygon([[[-136.198, 67.02], [-136.198, 59.83], [-96.73, 59.83], [-96.73, 67.02]]]);



// Palettes
var pal_cont = palettes.crameri.imola[25];
var pal_div = palettes.crameri.vik[25];



// Map
Map.setCenter(-104.76, 58.18, 3);
var Map_right = ui.Map();



// Band dict
var k_to_c = 273.15;
var min_prcp = 0;
var max_prcp = 500;
var min_t = -25;
var max_t = 25;
var min_cmi = -30;
var max_cmi = 30;

var era5_dict = {
  'Monthly precipitation sum': ['prcp', min_prcp, max_prcp / 1000, pal_cont],
  'Monthly tmin mean': ['tmin', min_t + k_to_c, max_t + k_to_c, pal_div],
  'Monthly tmax mean': ['tmax', min_t + k_to_c, max_t + k_to_c, pal_div],
  'CMI': ['CMI', min_cmi, max_cmi, pal_div]
};

var daymet_dict = {
  'Monthly precipitation sum': ['prcp', min_prcp, max_prcp, pal_cont],
  'Monthly tmin mean': ['tmin', min_t, max_t, pal_div],
  'Monthly tmax mean': ['tmax', min_t, max_t, pal_div],
  'CMI': ['CMI', min_cmi, max_cmi, pal_div]
};



// Panels 
var panel_right_chart = ui.Panel();
var panel_left_chart = ui.Panel();
var panel_middle_bottom = ui.Panel();

panel_right_chart.style().set({
  width: '400px',
  position: 'bottom-right'
});
panel_left_chart.style().set({
  width: '400px',
  position: 'bottom-left'
});
panel_middle_bottom.style().set({
  width: '200px',
  position: 'bottom-left'
});



// Band select
var era5_select = ui.Select({items: Object.keys(era5_dict)});
era5_select.setValue('CMI');

var daymet_select = ui.Select({items: Object.keys(daymet_dict)});
daymet_select.setValue('CMI');

// Year slider
var year_slider =  ui.Slider(1980, 2022, 2000, 1);

// N points slider
var n_pts_slider = ui.Slider(10, 100, 10, 5); 

// Generate button
var generate_button = ui.Button('Sample points', function() {
  var seed = Math.floor(Math.random() * 10);
  var n_pts = n_pts_slider.getValue();
  var points = ee.FeatureCollection.randomPoints(geometry, n_pts, seed);

  var year_list = ee.List.sequence(year_slider.getValue(), year_slider.getValue());
  var daymet = climate.monthly_daymet(year_list, month_list);
  daymet = daymet.map(cmi.calc_CMI);
  var era5 = climate.monthly_era5(year_list, month_list);
  era5 = era5.map(cmi_era5.calc_CMI_ERA5);

  var key_daymet = daymet_select.getValue();
  var key_era5 = era5_select.getValue();

  // Daymet
  Map_right.layers().reset();
  var daymet_viz = {
    min: daymet_dict[key_daymet][1],
    max: daymet_dict[key_daymet][2],
    palette: daymet_dict[key_daymet][3]
  };
  var daymet_map = ui.Map.Layer(daymet.first().select(daymet_dict[key_daymet][0]), daymet_viz, key_daymet);
  Map_right.add(daymet_map);

  panel_right_chart.clear();
  var chart = ui.Chart.image.seriesByRegion({ 
    imageCollection: daymet,
    regions: points,
    reducer: ee.Reducer.mean(),
    band: daymet_dict[key_daymet][0]
  }).setOptions({"title":year_slider.getValue() + ' - ' + 'Daymet', "colors": ["black"], 
                 "vAxis": {viewWindow: {min:daymet_dict[key_daymet][1], max: daymet_dict[key_daymet][2]}}});
  panel_right_chart.add(chart);

  var img_thumb = ui.Thumbnail(ee.Image.pixelLonLat().select(0)
  .clip(ee.Geometry.Rectangle({coords: [[-30, 0], [30, 7]], geodesic: false}))
  .visualize({min: daymet_dict[key_daymet][1], max: daymet_dict[key_daymet][2], palette: daymet_dict[key_daymet][3]}));
  panel_right_chart.add(ui.Label((daymet_dict[key_daymet][1]).toFixed(1) + ' ________________________ ' + (daymet_dict[key_daymet][2]).toFixed(1)));
  panel_right_chart.add(img_thumb);

  Map_right.add(ui.Map.Layer(points));

  // ERA5
  Map.layers().reset();
  var era5_viz = {
    min: era5_dict[key_era5][1],
    max: era5_dict[key_era5][2],
    palette: era5_dict[key_era5][3]
  };
  var era5_map = ui.Map.Layer(era5.first().select(era5_dict[key_era5][0]), era5_viz, key_era5);
  Map.add(era5_map);

  panel_left_chart.clear();
  var chart = ui.Chart.image.seriesByRegion({ 
    imageCollection: era5,
    regions: points,
    reducer: ee.Reducer.mean(),
    band: era5_dict[key_era5][0]
  }).setOptions({"title":year_slider.getValue() + ' - ' + 'ERA5', "colors": ["black"], 
                 "vAxis": {viewWindow: {min:era5_dict[key_era5][1], max: era5_dict[key_era5][2]}}});
  panel_left_chart.add(chart);

  var img_thumb = ui.Thumbnail(ee.Image.pixelLonLat().select(0)
  .clip(ee.Geometry.Rectangle({coords: [[-30, 0], [30, 7]], geodesic: false}))
  .visualize({min: era5_dict[key_era5][1], max: era5_dict[key_era5][2], palette: era5_dict[key_era5][3]}));
  panel_left_chart.add(ui.Label((era5_dict[key_era5][1]).toFixed(1) + ' ________________________ ' + (era5_dict[key_era5][2]).toFixed(1)));
  panel_left_chart.add(img_thumb);
  Map_right.add(ui.Map.Layer(points));

  Map.add(ui.Map.Layer(points));
}) 


// Fill, position panels
panel_middle_bottom.add(ui.Label('Select ERA5 band:'));
panel_middle_bottom.add(era5_select);
panel_middle_bottom.add(ui.Label('Select Daymet band:'));
panel_middle_bottom.add(daymet_select);
panel_middle_bottom.add(ui.Label('Select year:'));
panel_middle_bottom.add(year_slider);
panel_middle_bottom.add(ui.Label('Select number of points:'));
panel_middle_bottom.add(n_pts_slider);
panel_middle_bottom.add(generate_button);

Map_right.add(panel_right_chart);
Map_right.add(panel_middle_bottom);
Map.add(panel_left_chart);



// Linker
var linker = ui.Map.Linker([ui.root.widgets().get(0), Map_right]);

var splitPanel = ui.SplitPanel({
  firstPanel: linker.get(0),
  secondPanel: linker.get(1),
  orientation: 'horizontal',
  wipe: false,
  style: {stretch: 'both'}
});

ui.root.widgets().reset([splitPanel]);
