// DAYMET (+DEM) based CMI

// Functions
exports.calcETMAX = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * tmax / (237.3 + tmax)))', {
      'tmax': img.select('tmax')
    }).rename('ETMAX'));
};

exports.calcETMIN = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * tmin / (237.3 + tmin)))', {
      'tmin': img.select('tmin')
    }).rename('ETMIN'));
};

exports.calcETDEW = function(img) {
  return img.addBands(
    img.expression(
    '0.61078 * (2.71828182846 ** (17.269 * (tmin - 2.5) / (237.3 + tmin - 2.5)))', {
      'tmin': img.select('tmin')
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
    '(1.0 * ((tmin + tmax) / 2) + 5) / 15', {
      'tmin': img.select('tmin'),
      'tmax': img.select('tmax')
    }).rename('TAVG515'));
};

exports.calcKTRF = function(img) {
  return img.addBands(
    img.select('TAVG515')
       .where(img.select('TAVG515').lt(0), 0)
       .where(img.select('TAVG515').gt(1), 1)
       .rename('KTRF'));
};

exports.calcPET = function(img) {
  return img.addBands(
    img.expression(
    '93 * VPD * KTRF * (2.71828182846 ** (1.0 * ELEV / 9300))', {
      'VPD': img.select('VPD'),
      'KTRF': img.select('KTRF'),
      'ELEV': ee.Image("MERIT/DEM/v1_0_3")
      // ee.ImageCollection("NRCan/CDEM").select('elevation').mosaic()
    }).rename('PET'));
};

exports.calcCMI = function(img) {
  return img.addBands(
    img.expression(
    '1.0 * (PREC - PET) / 10', {
      'PREC': img.select('prcp'),
      'PET': img.select('PET')
    }).rename('CMI'));
};
