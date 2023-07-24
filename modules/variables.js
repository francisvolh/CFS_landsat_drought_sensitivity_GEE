/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
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

exports.bc = bounds.filter(ee.Filter.eq('placeName', 'British Columbia'));
exports.yukon = bounds.filter(ee.Filter.eq('placeName', 'Yukon'));

var western_can_ls = ['Yukon', 'Northwest Territories', 'Nunavut', 
                      'British Columbia', 'Alberta', 'Manitoba'];
exports.western_can = bounds.filter(ee.Filter.inList('placeName', western_can_ls));
