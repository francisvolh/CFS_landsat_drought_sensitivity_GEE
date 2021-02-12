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
    '(((tmin + tmax) / 2) + 5) / 15', {
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

exports.calcPET = function(img, dem) {
  return img.addBands(
    img.expression(
    '93 * VPD * KTRF * (2.71828182846 ** (ELEV / 9300))', {
      'VPD': img.select('VPD'),
      'KTRF': img.select('KTRF'),
      'ELEV': dem.select('elevation')
    }).rename('PET'));
};

exports.calcCMI = function(img) {
  return img.addBands(
    img.expression(
    '(PREC - PET) / 10', {
      'PREC': img.select('prcp'),
      'PET': img.select('PET')
    }).rename('CMI'));
};


// Calculate CMI
// Subset for
daymet = daymet.filter(ee.Filter.dayOfYear(150, 200)).limit(1);

daymet = daymet
  .map(calcETMAX)
  .map(calcETMIN)
  .map(calcETDEW)
  .map(calcVPD)
  .map(calcTAVG515)
  .map(calcKTRF)
  .map(calcPET)
  .map(calcCMI);




// Map.addLayer(daymet.select('tmin'), null, 'tmin')
// Map.addLayer(daymet.select('tmax'), null, 'tmax')
// Map.addLayer(daymet.select('ETMAX'), null, 'ETMAX')
// Map.addLayer(daymet.select('ETMIN'), null, 'ETMIN')
// Map.addLayer(daymet.select('ETDEW'), null, 'ETDEW')
Map.addLayer(daymet.select('VPD'), null, 'VPD')
// Map.addLayer(daymet.select('TAVG515'), null, 'TAVG515')
Map.addLayer(daymet.select('KTRF'), null, 'KTRF')
Map.addLayer(dem.select('elevation'), null, 'ELEV')
Map.addLayer(daymet.select('PET'), null, 'PET')
Map.addLayer(daymet.select('CMI'), null, 'CMI')
