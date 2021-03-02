// Export ----------------------------------------------------------------
var bandname = 'CMI_gt_ante6_p10';
Export.video.toDrive({
  'collection': drought.select([bandname, bandname, bandname],
                            ['1', '2', '3'])
                      .cast({'1':'uint8', '2':'uint8', '3':'uint8'},
                            ['1', '2', '3']),
  'description': 'baseline-gif-' + bandname,
  'region': geometry,
  'scale': 2000
})

var bandname = 'CMI';
Export.video.toDrive({
  'collection': aggDaymet.select([bandname, bandname, bandname],
                            ['1', '2', '3'])
                    .cast({'1':'uint8', '2':'uint8', '3':'uint8'},
                          ['1', '2', '3']),
  'description': 'daymet-gif-' + bandname,
  'region': geometry,
  'scale': 2000
})


// Thumb ------------------------------------------------------------------------------------
var args = {
  dimensions: '500',
  region: geometry,
  min: 0,
  max: 1,
  framesPerSecond: 1,
};

var thumb = ui.Thumbnail({
  image: drought.select('CMI_gt_ante6_p10'),
  params: args,
  style: {
    position: 'bottom-right',
    width: '320px'
  }});
Map.add(thumb);


var args = {
  dimensions: '500',
  region: geometry,
  min: -40,
  max: 40,
  framesPerSecond: 1,
  palette: ["ff0000","ffffff","0008ff"]
};

var thumb = ui.Thumbnail({
  image: drought.select('CMI'),
  params: args,
  style: {
    position: 'bottom-left',
    width: '320px'
  }});
Map.add(thumb);

