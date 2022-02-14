// Modules ----------------------------------------------------------
// Load modules of functions

// Aggregate functions
var agg = require('users/robitalec/CFS:modules/aggregate.js');

// CMI functions
var cmiDaymet = require('users/robitalec/CFS:modules/cmi-daymet.js');

// L5 prep functions
var l5prep = require('users/robitalec/CFS:modules/l5-prep.js');

// Land cover mask function
var lcmask = require('users/robitalec/CFS:modules/land-cover.js');

// Baseline functions
var baseline = require('users/robitalec/CFS:modules/baseline.js');

// Fire functions
var fire = require('users/robitalec/CFS:modules/fire.js');

// Sensitivity
var sensitivity = require('users/robitalec/CFS:modules/sensitivity.js');

// Gena's palette functions
var palettes = require('users/gena/packages:palettes');


// Data -------------------------------------------------------------
// CTEF regions
var ctef = ee.FeatureCollection('users/robitalec/CFS/CTEF_Ecoregions');
// ctef = ctef.filter(ee.Filter.stringContains('ZONE_EN', 'Arctic').not());
ctef = ctef.filter(ee.Filter.inList('REG_ID', ['CL13R02', 'CL13R03', 'CL13R04']));

// Aggregate --------------------------------------------------------
// Set min max year for daymet
var minyear = 1980;
var maxyear = 2019;

// Set list of years and months
var months = ee.List.sequence(1, 12);
var years = ee.List.sequence(minyear, maxyear);

var aggDaymet = cmiDaymet.prepDaymet(minyear, maxyear);

// Calculate CMI ----------------------------------------------------
// Calculate CMI (and ETMAX, ETMIN, ETDEW, VPD, TAVG 5, 15, KTRF and PET)
aggDaymet = aggDaymet
  .map(cmiDaymet.calcETMAX)
  .map(cmiDaymet.calcETMIN)
  .map(cmiDaymet.calcETDEW)
  .map(cmiDaymet.calcVPD)
  .map(cmiDaymet.calcTAVG515)
  .map(cmiDaymet.calcKTRF)
  .map(cmiDaymet.calcPET)
  .map(cmiDaymet.calcCMI);

// Calculate baseline -----------------------------------------------
// Set percentiles to use. Javascript list.
var percentiles = [1, 5, 10, 20];

// Calculate antecedent means across years. Eg. mean CMI for antecedent 3 period across years
var means = baseline.antecedentMeans(aggDaymet, 'CMI', years);

// Compare antecedent means to percentiles. Eg. mean CMI for ante 3 year 2011 vs full period 10%
var drought = baseline.gtPercentile(means, percentiles);

// Drop before 1985 since there's no complete antecedent 12 period (1980) or 5 yr (1980-1985)
drought = drought.filter(ee.Filter.gt('year', 1980));

// EVI/NDVI ---------------------------------------------------------
// Min/max years
var minyearl5 = 1985;
var maxyearl5 = 2012;
var yearsl5 = ee.List.sequence(minyearl5, maxyearl5);

// Load L5
// Filter within min/max year and for July
var veg = ee.ImageCollection("LANDSAT/LT05/C01/T1_SR")
  .filterBounds(ctef)
  .filter(ee.Filter.calendarRange(minyearl5, maxyearl5, 'year'))
  .filter(ee.Filter.calendarRange(7, 7, 'month'))
  .map(l5prep.cloudMaskL5)
  .map(l5prep.calcIndices);
veg = l5prep.aggregateY(yearsl5, veg);

// ----------------------------------------------------------------------


// RETURN baseline and drought NDVI/EVI/NBR/etc measures
// for each of p * antes * indices

var p = [1, 5, 15, 20]
var antes = [3, 6, 12]
var indices = ['NDVI', 'NBR', 'EVI']

var base = drought.first()

var p = 1
var antes = 3
var indices = 'NDVI'


var droughtmaskband = 'CMI_gt_ante' + antes + 'mo_p' + p
var antepindexband = indices + '_ante' + antes + 'mo_p' + p
var baseband = indices + '_base_p' + p

var droughtmask = base.select(droughtmaskband)
var basemask = base.select(droughtmaskband).eq(0)

var v = veg.first()
print(v)
var baseveg = v.select(indices)
               .updateMask(basemask)
               .rename([baseband]);

var droughtveg = v.select(indices)
                  .updateMask(droughtmask)
                  .rename([antepindexband])

var toreturn = ee.Image([baseveg, droughtveg]).copyProperties(v)
// return ee.Image([baseveg, veg3, veg6, veg12, veg5]).copyProperties(v);

// Return baseline and drought period NDVI/EVI measures

