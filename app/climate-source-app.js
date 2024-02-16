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
var year_list = ee.List.sequence(2006, 2006);
var month_list = ee.List.sequence(5, 10);
var seed = Math.floor(Math.random() * 10);
var geometry = ee.Geometry.Polygon([[[-136.198, 67.02], [-136.198, 59.83], [-96.73, 59.83], [-96.73, 67.02]]]);
var n_pts = 10;
var points = ee.FeatureCollection.randomPoints(geometry, n_pts, seed);
var chart_scale = 5e3;


// Data
var daymet = climate.monthly_daymet(year_list, month_list);
daymet = daymet.map(cmi.calc_CMI);
var era5 = climate.monthly_era5(year_list, month_list);
era5 = era5.map(cmi_era5.calc_CMI_ERA5);



// Palettes
var pal_cont = palettes.crameri.imola[25];
var pal_div = palettes.crameri.vik[25];



// Map
Map.setCenter(-104.76, 58.18, 3);
var Map_right = ui.Map();

var water_land = ee.ImageCollection("IDAHO_EPSCOR/TERRACLIMATE").first().mask();
water_land = water_land
  .mask(water_land.eq(0));
var water_land_viz_right = ui.Map.Layer(water_land);
var water_land_viz_left = ui.Map.Layer(water_land);



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
var panel_right = ui.Panel();
var panel_right_bottom = ui.Panel();
var panel_left = ui.Panel();
var panel_left_bottom = ui.Panel();

panel_right.style().set({
  width: '200px',
  position: 'top-right'
});
panel_right_bottom.style().set({
  width: '400px',
  position: 'bottom-right'
});
panel_left.style().set({
  width: '200px',
  position: 'top-left'
});
panel_left_bottom.style().set({
  width: '400px',
  position: 'bottom-left'
});



// Band select
var era5_select = ui.Select({
  items: Object.keys(era5_dict),
  onChange: function(key) {
    Map.layers().reset();
    var era5_viz = {
      min: era5_dict[key][1],
      max: era5_dict[key][2],
      palette: era5_dict[key][3]
    };
    var era5_map = ui.Map.Layer(era5.first().select(era5_dict[key][0]), era5_viz, key);
    Map.add(era5_map);
    Map.add(water_land_viz_right);

    panel_left_bottom.clear();
    var chart = ui.Chart.image.seriesByRegion({ 
      imageCollection: era5,
      regions: points,
      reducer: ee.Reducer.mean(),
      scale: 5e3,
      band: era5_dict[key][0]
    }).setOptions({"colors": ["black"], "vAxis": {viewWindow: {min:era5_dict[key][1], max: era5_dict[key][2]}}});
    panel_left_bottom.add(chart);
    Map.add(ui.Map.Layer(points));
  }
});

var daymet_select = ui.Select({
  items: Object.keys(daymet_dict),
  onChange: function(key) {
    Map_right.layers().reset();
    var daymet_viz = {
      min: daymet_dict[key][1],
      max: daymet_dict[key][2],
      palette: daymet_dict[key][3]
    };
    var daymet_map = ui.Map.Layer(daymet.first().select(daymet_dict[key][0]), daymet_viz, key);
    Map_right.add(daymet_map);
    Map_right.add(water_land_viz_left);

    panel_right_bottom.clear();
    var chart = ui.Chart.image.seriesByRegion({ 
      imageCollection: daymet,
      regions: points,
      reducer: ee.Reducer.mean(),
      scale: 5e3,
      band: daymet_dict[key][0]
    }).setOptions({"colors": ["black"], "vAxis": {viewWindow: {min:daymet_dict[key][1], max: daymet_dict[key][2]}}});
    panel_right_bottom.add(chart);
    Map_right.add(ui.Map.Layer(points));
  }
});



// Fill, position panels
panel_right.add(ui.Label('Select Daymet band:'));
panel_right.add(daymet_select);

panel_left.add(ui.Label('Select ERA5 band:'));
panel_left.add(era5_select);

Map_right.add(panel_right);
Map_right.add(panel_right_bottom);
Map.add(panel_left);
Map.add(panel_left_bottom);



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
