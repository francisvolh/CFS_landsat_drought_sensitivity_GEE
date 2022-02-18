// -- Load regions, land cover
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');


var geometry = ee.Geometry.Polygon([[[-128.69, 58.70], [-128.69, 50.66], [-111.20, 50.66], [-111.20, 58.70]]]);
          
print(ecoregions.filterBounds(geometry).aggregate_array('ECOREGI').distinct())
