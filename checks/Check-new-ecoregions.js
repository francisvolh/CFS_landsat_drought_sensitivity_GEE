/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-119.98933858557214, 60.01962504243995],
          [-119.98933858557214, 54.621440487085415],
          [-110.10164327307214, 54.621440487085415],
          [-110.10164327307214, 60.01962504243995]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var ecoregions = ee.FeatureCollection('users/robitalec/CFS/Terrestrial_Ecoregions_Canada');

Map.addLayer(ecoregions.filter(ee.Filter.inList('ECOREGI', [137, 138, 172, 175, 193, 194])))
Map.addLayer(ecoregions.filterBounds(geometry))