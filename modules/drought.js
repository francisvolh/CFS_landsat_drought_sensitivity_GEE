// Variables --------------------------------------------------------
// Set percentiles to use
var percentiles = [1, 5, 10, 20];

// Set min max year for daymet
var minyear = 1980;
var maxyear = 2019;

// Set list of years and months
var months = ee.List.sequence(1, 12);
var years = ee.List.sequence(minyear, maxyear);

// Modules ----------------------------------------------------------
// Load modules of functions

// Aggregate functions
var agg = require('users/robitalec/CFS:modules/aggregate.js');

// CMI functions
var cmiDaymet = require('users/robitalec/CFS:modules/cmi-daymet.js');

// Baseline functions
var baseline = require('users/robitalec/CFS:modules/baseline.js');

// Daymet -----------------------------------------------------------
// Aggregate
var aggDaymet = cmiDaymet.prepDaymet(minyear, maxyear);

// Calculate CMI (and ETMAX, ETMIN, ETDEW, VPD, TAVG 5, 15, KTRF and PET)
var cmi = aggDaymet
  .map(cmiDaymet.calcETMAX)
  .map(cmiDaymet.calcETMIN)
  .map(cmiDaymet.calcETDEW)
  .map(cmiDaymet.calcVPD)
  .map(cmiDaymet.calcTAVG515)
  .map(cmiDaymet.calcKTRF)
  .map(cmiDaymet.calcPET)
  .map(cmiDaymet.calcCMI);
Map.addLayer(cmi)
// Calculate baseline
// Calculate antecedent means across years. Eg. mean CMI for antecedent 3 period across years
var means = baseline.antecedentMeans(cmi, 'CMI', years);

// Compare antecedent means to percentiles. Eg. mean CMI for ante 3 year 2011 vs full period 10%
var drought = baseline.ltPercentile(means, percentiles);

// Drop since there's no complete antecedent 12 period (1980) or 5 yr (1980-1985)
drought = drought.filter(ee.Filter.gt('year', 1980));


exports.baselineCMI = function() {
  return drought
}