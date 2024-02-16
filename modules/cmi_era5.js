/*
Calculate CMI using ERA5
Alec L. Robitaille

Units for ERA5
Temperature: K
Precipitation: m

Conversion to expected units
Temperature: K - 273.15
Precipitation: m / 1000
*/

var conv_k_to_c = 273.15;
var conv_m_to_mm = 1000;


// Calculate ETMAX using tmax
var calc_ETMAX_band = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * tmax / (237.3 + tmax)))', {
      'tmax': img.select('tmax').subtract(conv_k_to_c)
    }).rename('ETMAX'));
};

// Calculate ETMIN using tmin
var calc_ETMIN_band = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * tmin / (237.3 + tmin)))', {
      'tmin': img.select('tmin').subtract(conv_k_to_c)
    }).rename('ETMIN'));
};

// Calculate ETDEW using tmin
var calc_ETDEW_band = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * (tmin - 2.5) / (237.3 + tmin - 2.5)))', {
      'tmin': img.select('tmin').subtract(conv_k_to_c)
    }).rename('ETDEW'));
};

// Calculate VPD using ETMAX, ETMIN, ETDEW
var calc_VPD_band = function(img) {
  return img.addBands(
    img.expression(
    '0.5 * (ETMAX + ETMIN) - ETDEW', {
      'ETMAX': img.select('ETMAX'),
      'ETMIN': img.select('ETMIN'),
      'ETDEW': img.select('ETDEW')
    }).rename('VPD'));
};

// Calculate Tavg 5, 15 using tmin, tmax
var calc_TAVG515_band = function(img) {
  return img.addBands(
    img.expression(
    '(1.0 * ((tmin + tmax) / 2) + 5) / 15', {
      'tmin': img.select('tmin').subtract(conv_k_to_c),
      'tmax': img.select('tmax').subtract(conv_k_to_c)
    }).rename('TAVG515'));
};

// Calculate KTRF, returning TAVG515 or if lt 0 returning 0, or if gt 1 returning 1
// (just capping within 0-1 range)
var calc_KTRF_band = function(img) {
  return img.addBands(
    img.select('TAVG515')
       .where(img.select('TAVG515').lt(0), 0)
       .where(img.select('TAVG515').gt(1), 1)
       .rename('KTRF'));
};

// Calculate PET using VPD, KTRF, and DEM
var calc_PET_band = function(img) {
  return img.addBands(
    img.expression(
    '93 * VPD * KTRF * (2.71828182846 ** (1.0 * ELEV / 9300))', {
      'VPD': img.select('VPD'),
      'KTRF': img.select('KTRF'),
      'ELEV': ee.Image("MERIT/DEM/v1_0_3")
      // ee.ImageCollection("NRCan/CDEM").select('elevation').mosaic()
    }).rename('PET'));
};

// Calculate CMI using prcp and PET
var calc_CMI_band = function(img) {
  return img.addBands(
    img.expression(
    '1.0 * (PREC - PET) / 10', {
      'PREC': img.select('prcp').divide(conv_m_to_mm),
      'PET': img.select('PET')
    }).rename('CMI'));
};

// Calculate CMI from input Daymet image
var calc_CMI_ERA5 = function(img) {
	img = calc_ETMAX_band(img);
	img = calc_ETMIN_band(img);
	img = calc_ETDEW_band(img);
	img = calc_VPD_band(img);
	img = calc_TAVG515_band(img);
	img = calc_KTRF_band(img);
	img = calc_PET_band(img);

	return calc_CMI_band(img);
};
exports.calc_CMI_ERA5 = calc_CMI_ERA5;
