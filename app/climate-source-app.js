/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-119.6574609375, 63.517238915030305],
          [-119.6574609375, 51.35535071053716],
          [-87.4894921875, 51.35535071053716],
          [-87.4894921875, 63.517238915030305]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Climate source comparison app
Alec L. Robitaille
 
*/



// Modules
var climate = require('users/robitalec/CFS:modules/climate.js');
var palettes = require('users/gena/packages:palettes');



// Variables
var year_list = ee.List.sequence(2002, 2002);
var month_list = ee.List.sequence(5, 5);



// Data
// TODO: temporary first()
var daymet = climate.monthly_daymet(year_list, month_list).first();
var era5 = climate.monthly_era5(year_list, month_list).first();



// Palettes
var p = palettes.crameri.imola[25];



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
var min_t = -20;
var max_t = 25;
var era5_dict = {
  'Monthly precipitation sum': ['prcp', min_prcp, max_prcp / 1000],
  'Monthly tmin mean': ['tmin', min_t + k_to_c, max_t + k_to_c],
  'Monthly tmax mean': ['tmax', min_t + k_to_c, max_t + k_to_c],
};

var daymet_dict = {
  'Monthly precipitation sum': ['prcp', min_prcp, max_prcp],
  'Monthly tmin mean': ['tmin', min_t, max_t],
  'Monthly tmax mean': ['tmax', min_t, max_t],
};



// Band select
var era5_select = ui.Select({
  items: Object.keys(era5_dict),
  onChange: function(key) {
    Map.layers().reset();
    var era5_viz = {
      palette: p,
      min: era5_dict[key][1],
      max: era5_dict[key][2]
    };
    var era5_map = ui.Map.Layer(era5.select(era5_dict[key][0]), era5_viz, key);
    Map.add(era5_map);
    Map.add(water_land_viz_right);
  }
});

var daymet_select = ui.Select({
  items: Object.keys(daymet_dict),
  onChange: function(key) {
    Map_right.layers().reset();
    var daymet_viz = {
      palette: p,
      min: daymet_dict[key][1],
      max: daymet_dict[key][2]
    };
    var daymet_map = ui.Map.Layer(daymet.select(daymet_dict[key][0]), daymet_viz, key);
    Map_right.add(daymet_map);
    Map_right.add(water_land_viz_left);
  }
});



// Panels 
var panel_right = ui.Panel();
var panel_left = ui.Panel();

panel_right.style().set({
  width: '200px',
  position: 'top-right'
});
panel_left.style().set({
  width: '200px',
  position: 'top-left'
});

panel_right.add(ui.Label('Select Daymet band:'));
panel_right.add(daymet_select);

panel_left.add(ui.Label('Select ERA5 band:'));
panel_left.add(era5_select);



Map_right.add(panel_right);
Map.add(panel_left);



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
