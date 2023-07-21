/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-168.15216754447385, 71.53974669486493],
          [-168.15216754447385, 49.47000556013458],
          [-92.74201129447385, 49.47000556013458],
          [-92.74201129447385, 71.53974669486493]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/*
Variables
Alec L. Robitaille

Geoboundaries
Runfola D, Anderson A, Baier H, Crittenden M, Dowker E, Fuhrig S, et al. (2020)
geoBoundaries: A global database of political administrative boundaries. PLoS ONE 15(4):
e0231866. https://doi.org/10.1371/journal.pone.0231866

*/

// Modules
var palettes = require('users/gena/packages:palettes');



// Variables
exports.index_list = ['NDVI'];
exports.ante_list = ['3mo', '12mo', '3yr'];//, '1lag', '2lag', '3lag'];
exports.min_year_landsat = 1985;
exports.min_year_daymet = 1980;
exports.max_year = 2020;
exports.min_mm_dd = '06-01';
exports.max_mm_dd = '09-30';
exports.percentile_low = 15;
exports.percentile_high = 85;
exports.months = ee.List.sequence(1, 12);
exports.weeks = ee.List.sequence(1, 52);
exports.min_drought_nobs = 3;
exports.min_baseline_nobs = 21;



// Palettes
var p_diverging = palettes.crameri.vik[10];
exports.cmi_viz = {min:-15, max:15, palette: p_diverging};
exports.rel_viz = {min:-20, max:20, palette: p_diverging};
exports.abs_viz = {min:-0.2, max:0.2, palette: p_diverging};



// Geometries
var bounds = ee.FeatureCollection('projects/earthengine-legacy/assets/projects/sat-io/open-datasets/geoboundaries/CGAZ_ADM1');

exports.dawson = ee.Geometry.Polygon(
	[[[-140.98169334224528, 64.89866428936777],
	[-140.98169334224528, 63.10300863803273],
	[-137.86706931880778, 63.10300863803273],
	[-137.86706931880778, 64.89866428936777]]]);

exports.western_can = ee.Geometry.Polygon(
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

exports.bc = bounds.filter(ee.Filter.eq('shapeName', 'British Colombia'));

exports.yukon = ee.Geometry.Polygon(
  [[[-141.03564838179497, 65.29837358256377],
  [-141.14551166304497, 61.117076110171034],
  [-139.10205463179497, 59.9938683577217],
  [-137.38818744429497, 59.93888090358338],
  [-129.74170306929497, 59.98287816850865],
  [-123.80908588179496, 59.905844598822966],
  [-124.02881244429496, 60.09261594397401],
  [-124.57812885054496, 60.90409694970527],
  [-126.62158588179496, 60.8185046463646],
  [-127.93994525679496, 61.737084421224544],
  [-129.80762103804497, 63.17949034543585],
  [-132.32551751640625, 64.93059438270835],
  [-133.95149407890625, 66.9967609655182],
  [-136.19270501640625, 67.04822570308592],
  [-136.45637689140625, 68.43763003906189],
  [-141.02668939140625, 68.44570385411821]]]);

exports.yt_to_mb = ee.Geometry.Polygon(
   [[[-140.61272043854052, 69.60272090467828],
          [-140.61272043854052, 43.912011140261754],
          [-91.21818918854052, 43.912011140261754],
          [-91.21818918854052, 69.60272090467828]]]);
