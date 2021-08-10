// MODIS prep


exports.rescale = function(img) {
  return img.multiply(0.0001)
            .float()
            .copyProperties(img)
            .set('system:time_start', img.get('system:time_start'));
};

// var water = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24").select('water_mask');
var water = ee.Image("JRC/GSW1_3/GlobalSurfaceWater")
                    .select('occurrence')
                    .gt(0.7)
                    .unmask()
                    .not();
exports.maskWater = function(img) {
  return img.updateMask(water.not());
};


// For MOD09A1
// Name 	        Description 	                  (band) 	Wavelength    Scale 
// sur_refl_b01 	Surface reflectance for band 1  Red 		620-670nm   	0.0001
// sur_refl_b02 	Surface reflectance for band 2 	NIR 		841-876nm   	0.0001
// sur_refl_b03 	Surface reflectance for band 3 	Blue 		459-479nm   	0.0001
// sur_refl_b04 	Surface reflectance for band 4 	Green 	545-565nm   	0.0001
// sur_refl_b05 	Surface reflectance for band 5 	NIR  		1230-1250nm 	0.0001
// sur_refl_b06 	Surface reflectance for band 6 	SWIR 		1628-1652nm 	0.0001
// sur_refl_b07 	Surface reflectance for band 7 	SWIR 		2105-2155nm 	0.0001
// QA 	Surface reflectance 500m band quality control flags 				
exports.calcIndices = function(img) {
  return ee.Image([
    img.expression('(nir - red) / (nir + red)',
                   {red: img.select('sur_refl_b01'),
                    nir: img.select('sur_refl_b02')})
       .rename('NDVI'),
     img.expression('(nir - swir2) / (nir + swir2)',
                   {nir: img.select('sur_refl_b01'),
                    swir2: img.select('sur_refl_b07')})
       .rename('NBR'),
     img.expression('2.5 * ((nir - red) / (nir + 6 * red - 7.5 * blue + 1))',
                   {blue: img.select('sur_refl_b03'),
                    red: img.select('sur_refl_b01'),
                    nir: img.select('sur_refl_b02')})
       .rename('EVI'),
     img.select('pixel_qa')
  ]).copyProperties(img).set({'system:time_start': img.date().millis()});
};
