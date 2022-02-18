/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-128.6947831116304, 58.709490264301685],
          [-128.6947831116304, 50.664798971876166],
          [-111.20454873663037, 50.664798971876166],
          [-111.20454873663037, 58.709490264301685]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// -- Load regions, land cover
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

print(ecoregions.filterBounds(geometry).aggregate_array('ECOREGI').distinct())
