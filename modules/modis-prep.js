// MODIS prep

 
exports.rescale = function(img) {
  return img.multiply(0.0001)
            .float()
            .copyProperties(img)
            .set('system:time_start', img.get('system:time_start'));
};


// MODIS prep


exports.rescale = function(img) {
  return img.multiply(0.0001)
            .float()
            .copyProperties(img)
            .set('system:time_start', img.get('system:time_start'));
};

// For MOD09A1
// Name 	        Description 	                  Min 	Max 	    Wavelength  Scale 
// sur_refl_b01 	Surface reflectance for band 1 	-100 	16000 		620-670nm 	0.0001
// sur_refl_b02 	Surface reflectance for band 2 	-100 	16000 		841-876nm 	0.0001
// sur_refl_b03 	Surface reflectance for band 3 	-100 	16000 		459-479nm 	0.0001
// sur_refl_b04 	Surface reflectance for band 4 	-100 	16000 		545-565nm 	0.0001
// sur_refl_b05 	Surface reflectance for band 5 	-100 	16000 		1230-1250nm 	0.0001
// sur_refl_b06 	Surface reflectance for band 6 	-100 	16000 		1628-1652nm 	0.0001
// sur_refl_b07 	Surface reflectance for band 7 	-100 	16000 		2105-2155nm 	0.0001
// QA 	Surface reflectance 500m band quality control flags 				
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('NDVI'),
     img.expression('(nir - swir2) / (nir + swir2)',
                   {nir: img.select('B4'),
                    swir2: img.select('B7')})
       .rename('NBR'),
     img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
                   {blue: img.select('B1'),
                    red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('EVI'),
     img.select('pixel_qa')
  ]).copyProperties(img).set({'system:time_start': img.date().millis()});
};
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('NDVI'),
     img.expression('(nir - swir2) / (nir + swir2)',
                   {nir: img.select('B4'),
                    swir2: img.select('B7')})
       .rename('NBR'),
     img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
                   {blue: img.select('B1'),
                    red: img.select('B3'),
                    nir: img.select('B4')})
       .rename('EVI'),
     img.select('pixel_qa')
  ]).copyProperties(img).set({'system:time_start': img.date().millis()});
};