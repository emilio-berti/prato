function ndvi_year(year, plot){
  var dataset = ee.ImageCollection('MODIS/006/MOD13Q1') //2000 to 2021
                  .filter(ee.Filter.date(year + '-01-01', year + '-12-31'));
  var ndvi = dataset
    .select('NDVI')
    .reduce({
      reducer: ee.Reducer.sum(),
      })
      .clip(galceti);
  if (plot === true) {
    var ndviVis = {
      min: -6000,
      max: 210000,
      palette: [
        'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
        '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
        '012E01', '011D01', '011301'
      ],
    };
    Map.addLayer(ndvi, ndviVis, 'NDVI ' + year);
  }
  return(ndvi)
}

var ndvi_2000 = ndvi_year(2000);
var ndvi_2001 = ndvi_year(2001);
var ndvi_2015 = ndvi_year(2015);
var ndvi_2020 = ndvi_year(2020);
Map.addLayer(ndvi_2020, diffVis, 'NDVI 2020');

var ndvi_diff = ndvi_2020.subtract(ndvi_2015);
Map.addLayer(ndvi_diff, diffVis, 'NDVI difference');

// Average NDVI for all years ---------
for (var year = 2001; year <= 2021; year++) {
  Export.image.toDrive({
    image: ndvi_year(year).float(),
    description: "Prato_NDVI_avg_" + year,
    scale: 250,
    region: galceti
  });
}

// NDVI difference for all years and year leaps ------
/*for (var first = 2000; first < 2002; first++) {
  for (var second = 2001; second <= 2002; second++) {
    if (first != second) {
      Export.image.toDrive({
        image: ndvi_year(second).subtract(ndvi_year(first)).float(),
        description: "NDVI_diffence_" + second + '-' + first,
        scale: 250,
        region: galceti
      });
    }
  }
}*/

