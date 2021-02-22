// TERRA CLIMATE (+DEM) based CMI

// aet 	Actual evapotranspiration, derived using a one-dimensional soil water balance model 	0 	3140 	mm 	0.1
// def 	Climate water deficit, derived using a one-dimensional soil water balance model 	0 	4548 	mm 	0.1
// pdsi 	Palmer Drought Severity Index 	-4317 	3418 		0.01
// pet 	Reference evapotranspiration (ASCE Penman-Montieth) 	0 	4548 	mm 	0.1
// pr 	Precipitation accumulation 	0 	7245 	mm 	0
// ro 	Runoff, derived using a one-dimensional soil water balance model 	0 	12560 	mm 	0
// soil 	Soil moisture, derived using a one-dimensional soil water balance model 	0 	8882 	mm 	0.1
// srad 	Downward surface shortwave radiation 	0 	5477 	W/m^2 	0.1
// swe 	Snow water equivalent, derived using a one-dimensional soil water balance model 	0 	32767 	mm 	0
// tmmn 	Minimum temperature 	-770 	387 	°C 	0.1
// tmmx 	Maximum temperature 	-670 	576 	°C 	0.1
// vap 	Vapor pressure 	0 	14749 	kPa 	0.001
// vpd 	Vapor pressure deficit 	0 	1113 	kPa 	0.01
// vs 	Wind-speed at 10m 	0 	2923 	m/s 	0.01 

// Functions
exports.calcETMAX = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * (tmax / 10.0) / (237.3 + (tmax / 10.0))))', {
      'tmax': img.select('tmmx')
    }).rename('ETMAX'));
};

exports.calcETMIN = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * (tmin / 10.0) / (237.3 + (tmin / 10.0))))', {
      'tmin': img.select('tmmn')
    }).rename('ETMIN'));
};

exports.calcETDEW = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * ((tmin / 10.0) - 2.5) / (237.3 + (tmin / 10.0) - 2.5)))', {
      'tmin': img.select('tmmn')
    }).rename('ETDEW'));
};


exports.calcVPD = function(img) {
  return img.addBands(
    img.expression(
    '0.5 * (ETMAX + ETMIN) - ETDEW', {
      'ETMAX': img.select('ETMAX'),
      'ETMIN': img.select('ETMIN'),
      'ETDEW': img.select('ETDEW')
    }).rename('VPD'));
};

exports.calcTAVG515 = function(img) {
  return img.addBands(
    img.expression(
    '((((tmin / 10.0) + (tmax / 10.0)) / 2) + 5) / 15', {
      'tmin': img.select('tmmn'),
      'tmax': img.select('tmmx')
    }).rename('TAVG515'));
};

exports.calcKTRF = function(img) {
  return img.addBands(
    img.select('TAVG515')
      .where(img.select('TAVG515').lt(0), 0)
      .where(img.select('TAVG515').gt(1), 1)
      .rename('KTRF'));
};

exports.calcPET = function(img, dem) {
  return img.addBands(
    img.expression(
    '93 * VPD * KTRF * (2.71828182846 ** (ELEV / 9300.0))', {
      'VPD': img.select('VPD'),
      'KTRF': img.select('KTRF'),
      'ELEV': ee.Image("MERIT/DEM/v1_0_3")
      // ee.ImageCollection("NRCan/CDEM").select('elevation').mosaic()
    }).rename('PET'));
};
 
exports.calcCMI = function(img) {
  return img.addBands(
    img.expression(
    '(PREC - PET) / 10.0', {
      'PREC': img.select('pr'),
      'PET': img.select('PET')
    }).rename('CMI'));
};