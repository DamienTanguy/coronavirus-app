'use strict';

/* Controllers */

angular.module('app.controllers').controller('MapCtrl', ['$scope', '$http','$rootScope','$q','_export','$location',
                                                        function($scope, $http, $rootScope, $q, _export,$location) {

  $scope.LayerToRemove = [];
  /*****************************HOME BUTTON***************************************/
  $('#home_button').click(function() {
    location.reload();
});

  //VERSION FINALE: NO NEED DISTRICT NAME REQUEST BECAUSE INCLUDE IN CROP-STATICTICS OBJECT
  $http.post('/api/district_name',{}).then(function(data) {
    $scope.district_name_list = data.data[0];
  });

 /******************** CALL OF NEW MAP INFORMATION*************************************/
 $rootScope.$watch('map_id_displayed', function() {
    if($rootScope.map_id_displayed) {
      //remove all the layer
      for (var i=0;i<$scope.LayerToRemove.length;i++){
        map.removeLayer($scope.LayerToRemove[i]);
      }
      $scope.LayerToRemove = [];
      //image.getSource().updateParams({'LAYERS': ''});
      //display legend       
      $http.post('/api/legend_reference',{map_id:$rootScope.map_id_displayed}).success(function(data) {
          $scope.legend = data;
      });
      /******************** CALL OF NEW MAP INFORMATION *************************************/
      //display_unit       
      $http.post('/api/display_unit_map',{id:$rootScope.map_id_displayed}).success(function(data) {
          $scope.du = data;
          $('.legend_table').css("opacity","1");
          $('.display_unit_label').css("opacity","1");
        });
      $rootScope.subtitle = '  —  ' + $rootScope.filename; // subtitle definition
      closer.onclick(); //close tolltip
      vector.getSource().clear(); //close green point
      if($rootScope.data_type === 1){
        //liste des informations raster à afficher
        $scope.body_map_to_display = {
            map_id: $rootScope.map_id_displayed
        };
        $http.post('/api/link_map_information_to_display',$scope.body_map_to_display).success(function(data) {
          $scope.map_list = data;
        });
      }
    }
  }); 

 /******************** CALL OF THE NEW LAYER*************************************/
 $scope.$watch('legend', function() {
      //Check the type of the map
      //type: raster
      if($rootScope.data_type === 1){
        /*raster*/
        var image = new ol.layer.Tile({
            source: new ol.source.TileWMS({
              url: 'http://'+ $location.host() + ':8080/geoserver/naez_demo_version/gwc/service/wms',
              params: {'FORMAT': format, 
                       'VERSION': '1.1.1',
                       tiled: true,
                    LAYERS: 'naez_demo_version:' + $rootScope.layer_name[0].name,
                    STYLES: '',
              },
              crossOrigin: 'Anonymous'
            })
          });
        $scope.LayerToRemove.push(image);
        map.addLayer(image);
        map.removeLayer(border);
        map.addLayer(border);
        map.removeLayer(vector);
        map.addLayer(vector);
        //image.getSource().updateParams({LAYERS:'naez_demo_version:'+ $rootScope.layer_name[0].name });
        
      }else if ($rootScope.data_type === 2){
          for (var i=0;i<$rootScope.layer_name.length;i++){
            /*call of each layer*/
            var shapefile_layer = new ol.layer.Tile({
                source: new ol.source.TileWMS({
                  url: 'http://'+ $location.host() + ':8080/geoserver/naez_demo_version/gwc/service/wms',
                  params: {'FORMAT': format, 
                           'VERSION': '1.1.1',
                           tiled: true,
                        LAYERS: 'naez_demo_version:' + $rootScope.layer_name[i].name,
                        STYLES: '',
                  },
                  crossOrigin: 'Anonymous'
                })
              });
            $scope.LayerToRemove.push(shapefile_layer);
            map.addLayer(shapefile_layer);
          }
      }else if ($rootScope.data_type === 3){ 
      //type: vector
        //to get the criteria needed
        //VERSION FINALE: ADD THE OTHER CRITERIA
        $scope.body_crop_statistic = {
            crop_id: $rootScope.crop_id,
            legend: $scope.legend
          }; 
        $http.post('/api/crop_statistic',$scope.body_crop_statistic).then(function(data) {
          $scope.color_value = data.data;

          /*$scope.value = data.data[0];
          //creation of distinct value table to create a color-pixel_value table
          $scope.color_value = {};
          $scope.value_table = [];
          $scope.distinct_value = [];
          //store all the value
          for (var i=0;i<$scope.value.length;i++){
            $scope.value_table.push($scope.value[i].value);
          }
          //VERSION FINALE: MANAGEMENT DU 0 A MODIFIER
          $scope.value_table.push(0.1);
          //store only the distinct value
          $scope.distinct_value = new Set($scope.value_table);
          //allocation of the color name to the pixel value
          for (var val of $scope.distinct_value){
            for (var i=0;i<$scope.legend.length-1;i++){
              if(val >= 0 && val <= $scope.legend[1].pixel_value) 
              { 
                $scope.color_value[val] = Hex2rgb($scope.legend[0].color); 
              }
              else if(val > $scope.legend[i].pixel_value && val <= $scope.legend[i+1].pixel_value) 
              { 
                $scope.color_value[val] = Hex2rgb($scope.legend[i].color); 
              }else if(val > $scope.legend[$scope.legend.length-1].pixel_value) {
                $scope.color_value[val] = Hex2rgb($scope.legend[$scope.legend.length-1].color);
              }
            }
          }*/
        });
      }
    });

 /******************** TABULAR DATA*************************************/
  $scope.$watch('color_value', function() {
        if($scope.color_value){
          //definition and adding of the district layer
          var format_geojson = new ol.format.GeoJSON();
          var districtSource = new ol.source.Vector({
            format: format_geojson,
            url : 'http://'+ $location.host() + ':8080/geoserver/naez_demo_version/gwc/service/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=naez_demo_version:District_07072018&outputFormat=application%2Fjson',
            strategy : ol.loadingstrategy.bbox
          
          });
          var district_layer = new ol.layer.Vector({
            renderMode: 'image',
            source: districtSource,
            style: styleFunction
          });
          $scope.LayerToRemove.push(district_layer);
          map.addLayer(district_layer);
          //when the layer is ready to be customize
          var key = districtSource.on('change', function(event) {
            if (districtSource.getState() == 'ready') {
              var district_value_object = {};
            //if ($scope.district_name_list && $scope.value) {
              if ($scope.district_name_list && $scope.color_value[99]) {
                for (var i=0;i<$scope.district_name_list.length;i++){
                  //VERSION FINALE: MANAGEMENT DU 0 A MODIFIER : 0 c'est NA ou 0 ?????
                  /*if ($scope.value[i].value === 0) {
                    $scope.value[i].value = 0.1;
                  }*/
                  //district_value_object[$scope.district_name_list[i].eng_name] = $scope.value[i].value; 
                  district_value_object[$scope.district_name_list[i].eng_name] = $scope.color_value[99][i]; 
                }
              }
              district_layer.getSource().forEachFeature(function(feature) {
                var district_eng_name = feature.get('Eng_Name');
                if (district_value_object[district_eng_name]) { //value
                  //set the feature name to be able to get it in the styleFunction
                  feature.set('Value', district_value_object[district_eng_name]);
                }
              });
            }
          });

          //to put the border layer upon the district layer
          map.removeLayer(border);
          map.addLayer(border);
          //map.removeLayer(vector);
          //map.addLayer(vector);
      }
  });
/*****************************************/

/*********************************************************************** PARTIE GRAPHIQUE ********************************************************************************************/

  var ctx = document.getElementById("myChart");
  var context = ctx.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  });                                               

/*********************************************************************** LEGEND COLOR ********************************************************************************************/

  //color establishment
  $scope.def_color = function(x)
  {
      return {'background-color':x};
  }; 

/*********************************************************************** TOOLTIP ********************************************************************************************/

  /*http://openlayers.org/en/latest/examples/popup.html*/
    /*https://stackoverflow.com/questions/33696201/openlayers-3-wms-getfeatureinfo-popup*/
    /*Elements that make up the popup.*/
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    /* Create an overlay to anchor the popup to the map.*/
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });

    /*Add a click handler to hide the popup. @return {boolean} Don't follow the href.*/
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

/*********************************************************************** PARTIE WMS ********************************************************************************************/
    var format = 'image/png';
      var bounds = [90,10,
                    120, 25];
    
      function formatCoord(fraction) {
        var template = 'Lon: {x} Lat: {y}';
          return (
            function(coordinate) {
              return ol.coordinate.format(coordinate, template, fraction);
          });
      }

      var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: formatCoord(2),
        projection: 'EPSG:4326',
        className: 'custom-mouse-position',
        target: document.getElementById('mouse-position'),
        undefinedHTML: '&nbsp;'
      });

    /*land*/
    var land_background = new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'http://'+ $location.host() + ':8080/geoserver/naez_demo_version/gwc/service/wms',
          params: {'FORMAT': format, 
                   'VERSION': '1.1.1',
                   tiled: true,
                LAYERS: 'naez_demo_version:land_background',
                STYLES: '',
          },
          crossOrigin: 'Anonymous'
        })
      });
    /*border*/
    var border = new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: 'http://'+ $location.host() + ':8080/geoserver/naez_demo_version/gwc/service/wms',
          params: {'FORMAT': format, 
                   'VERSION': '1.1.1',
                   tiled: true,
                LAYERS: 'naez_demo_version:borders',
                STYLES: '',
          },
          crossOrigin: 'Anonymous'
        })
      });
    /*raster*/
    /*var image = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          ratio: 1,
          url: 'http://'+ $location.host() + ':8080/geoserver/naez_demo_version/gwc/service/wms',
          params: {'FORMAT': format,
                   'VERSION': '1.1.1',
                   tiled: true,
                LAYERS: '',
                STYLES: '',
          },
          crossOrigin: 'Anonymous'
        })
      });*/

      var projection = new ol.proj.Projection({
          code: 'EPSG:4326',
          units: 'degrees',
          axisOrientation: 'neu'
      });

/*********************************************************************** PARTIE WFS ********************************************************************************************/
      var source = new ol.source.Vector();

      var view = new ol.View({
           projection: projection
        })

      var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: '#545454'
          }),
          stroke: new ol.style.Stroke({
            color: '#545454',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
              color: '#545454'
            })
          })
        })
      });

      var map = new ol.Map({
        controls: ol.control.defaults({
          attribution: false
        }).extend([mousePositionControl]),
        overlays: [overlay],
        target: 'map',
        layers: [
          land_background,
          //district_layer,
          border,
          //image,
          vector
        ],
        view: view
      });


/*********************************************************************** PARTIE EVENEMENT ********************************************************************************************/
    map.on('click', function(evt) {
      if($rootScope.data_type === 1){
        var coordinate = map.getEventCoordinate(evt.originalEvent);
        var long = coordinate[0];
        var lat = coordinate[1];
        var map_list = $scope.map_list;
        //var leg_ref_list = $scope.legend_ref_list; 
        var map_id_displayed = $rootScope.map_id_displayed
        $scope.body_information = {
          long: long,
          lat: lat,
          map_list: map_list,
          map_id_displayed: map_id_displayed 
        };   
        if(map_list !== undefined){
          $http.post('/api/map_information',$scope.body_information).then(function(data) {
            content.innerHTML = '';
            content.innerHTML = data.data;
          });                     
          overlay.setPosition(evt.coordinate);
        }
      }else if($rootScope.data_type === 2){
          
        displayInformationWMSlayer(evt);

      }else if($rootScope.data_type === 3){
            var pixel = evt.pixel;
            //var coordinate = map.getEventCoordinate(evt.originalEvent);
            displayFeatureInfo(pixel,evt);
      }

      });

    /*WFS features **************OK***********/
    var displayFeatureInfo = function(pixel,evt) {
        var features = [];
        map.forEachFeatureAtPixel(pixel, function(feature, layer) {
          features.push(feature.getProperties());
        });
        //console.log($rootScope.layer_name);
        var information = '';
        information += '<table class="tooltip_table  shapefile_layer">'+'<tr>';
        information += '<td>'+ 'Name : ' + '</td>' + '<td class="tooltip_table_values">' + $rootScope.layer_name[0].name + '</td>' + '</tr>';
        for(var key in features[0]){ 
          var value = features[0][key];
          if(typeof value === 'object'){
          }else{
            information += '<td>'+ key + '</td>' + '<td class="tooltip_table_values">' + value + '</td>' + '</tr>';
          }
        }
        information += '</table>';
        //console.log(information);
        content.innerHTML = information;
        overlay.setPosition(evt.coordinate);
      };

    var displayInformationWMSlayer = function(evt) {
      var viewProjection = view.getProjection();
      var viewResolution = view.getResolution();
      for (var i=0;i<$rootScope.layer_name.length;i++){
        var url = $scope.LayerToRemove[i].getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, viewProjection,{LAYERS: 'naez_demo_version:' + $rootScope.layer_name[i].name});
        //console.log(url);
        if (url) {
          $.ajax({
            url: url,
            dataType: 'html',
            crossDomain: true,
            success: function(result){
              //console.log(url);
              if(result.length !== 23){
                //console.log(result);
                var result_filter = result.match(/(?<=---\s+).*?(?=\s+---)/gs); //with only information that I need
                var result_filter_by_line = result_filter[0].split("\n"); // object = value
                var result_table_object = [];
                var result_table_value = [];
                for (var i=0;i<result_filter_by_line.length;i++){
                  var result_temp = [];
                  result_temp = result_filter_by_line[i].split("=");
                  if(result_temp[1] === ' null'){
                    result_temp[1] = ' ';
                  }
                  if(result_temp[0] !== 'geom '){
                     result_table_object.push(result_temp[0]);
                     result_table_value.push(result_temp[1]);
                  }
                }

                var information = '';
                information += '<table class="tooltip_table shapefile_layer">'+'<tr>';
                for(var i=0;i<result_table_value.length;i++){
                    
                    information += '<td>'+ result_table_object[i] + '</td>' + '<td class="tooltip_table_values">' + result_table_value[i] + '</td>' + '</tr>';
                }
                information += '</table>';
                content.innerHTML = information;
                overlay.setPosition(evt.coordinate);
              }
            }
          })
        }
      }
    }

/************************************************************TEST STYLE FUNCTION DEBUT**** OK ***********************************************************/
      // SOURCE: https://openlayersbook.github.io/ch06-styling-vector-layers/example-07.html
      // define some colours matching some arbitrary divisions of the OECD income data
      /*var green_1 = [0,102,0,1];
      var green_2 = [0,204,0,1];
      var orange_1 = [255,165,0,1];
      var orange_2 = [255,184,51,1];
      var red_1 = [204,0,0,1];
      var red_2 = [255,51,51,1];*/

      function Hex2rgb(hex/*,opacity*/){
        var result = [];
        var hex = hex.replace('#','');
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        result[0] = r;
        var g = (bigint >> 8) & 255;
        result[1] = g;
        var b = bigint & 255;
        result[2] = b;

        //var result = '['+r+','+g+','+b+','+opacity+']';
        return result;
      }

      // a default style is good practice!
      var defaultStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: [204,204,255,1] //white
        }),
        stroke: new ol.style.Stroke({
          color: [224,224,224,1], //blue
          width: 1
        })
      });

      // a javascript object literal can be used to cache previously created styles. Its very important for
      // performance to cache styles.
      var styleCache = {};

      // the style function returns an array of styles for the given feature and resolution.
      // Return null to hide the feature.
      function styleFunction(feature, resolution) {
        // get the name of the district from the feature properties
        var district = feature.get('Value');
        // if there is no district or its one we don't recognize,return the default style (in an array!)
        if (!district || !$scope.color_value[district]) {
          return [defaultStyle];
        }
        // check the cache and create a new style for the income district if its not been created before.
        if (!styleCache[district]) {
          styleCache[district] = new ol.style.Style({
            fill: new ol.style.Fill({
              color: $scope.color_value[district]
            }),
            stroke: new ol.style.Stroke({
              color: [224,224,224,1], //blue
              width: 1
        })
          });
        }
        // at this point, the style for the current district is in the cache so return it (as an array!)
        return [styleCache[district]];
      }
      
/************************************************************ STYLE FUNCTION FIN *** OK **************************************************************/

      /*tooltip*/
      map.getView().fit(bounds, map.getSize());
      map.updateSize();
      
      //************************A GARDER***************************
      /*map.on('singleclick', function(evt) {
        var coordinate = map.getEventCoordinate(evt.originalEvent);
        var long = coordinate[0];
        var lat = coordinate[1];
        var map_list = $scope.map_list;
        //var leg_ref_list = $scope.legend_ref_list; 
        var map_id_displayed = $rootScope.map_id_displayed
        $scope.body_information = {
          long: long,
          lat: lat,
          map_list: map_list,
          map_id_displayed: map_id_displayed 
        };   
        if(map_list !== undefined){
          $http.post('/api/map_information',$scope.body_information).then(function(data) {
            content.innerHTML = '';
            content.innerHTML = data.data;
          });                     
          overlay.setPosition(evt.coordinate);
        }
        
      });*/ // end singleclick

       /*tooltip point*/
      var draw; // global so we can remove it later
      function addInteraction() {
          draw = new ol.interaction.Draw({
            source: source,
            type: 'Point',
            style: new ol.style.Style({
              image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                color: '#105010'
              })
            })
          })
          });
          map.addInteraction(draw);
      }
      addInteraction();
      draw.on('drawstart', function() { vector.getSource().clear(); });

/*********************************************************************** PARTIE DOWNLOAD ********************************************************************************************/

/*********************** EXPORT GRAPHIQUE ***********************************/
$scope.print = function(id) {
  $("#"+ id).css('background-color', 'white');
  _export.htmltocanvas(id);
}
/*********************** FIN EXPORT GRAPHIQUE *******************************/

/*********************** PDF ***********************************/
/*http://openlayers.org/en/latest/examples/export-pdf.html*/
/*https://github.com/openlayers/openlayers/issues/5780*/
var loading = 0;
var requestedTiles = {};
var canvas;
var onTilesLoaded = null;

var tileLoadStart = function(ev) {
  ++loading;
};

var tileLoadEnd = function(ev) {
  --loading;
  if (loading === 0 && onTilesLoaded){
    onTilesLoaded();  
    onTilesLoaded = null;
  }
}

var tileLoadError = function(ev) {
  tileLoadEnd(ev);
}

map.once('postcompose', function(event) {
  canvas = event.context.canvas;
});
if($rootScope.map_id_displayed) {
  var source = image.getSource(); //osm.getSource();
  source.on('tileloadstart', tileLoadStart);
  source.on('tileloadend', tileLoadEnd);
  source.on('tileloaderror', tileLoadError);
}

var exportButton = document.getElementById('export_pdf');

exportButton.addEventListener('click', function() {

  exportButton.disabled = true;
  document.body.style.cursor = 'progress';
  var width = 842;
  var height = 595;
  var size = /** @type {ol.Size} */ (map.getSize());
  var extent = map.getView().calculateExtent(size);
  
  map.setSize([width, height]);
  map.getView().fit(extent, /** @type {ol.Size} */ (map.getSize()));
  map.renderSync();
  // use set timeout so the tiles have a chance to load
  window.setTimeout(function() { 
    if (loading === 0) {  
       _export.MapToPDF(canvas,$rootScope.filename);
      loading = 0;          
      map.setSize(size);
      map.getView().fit(extent, size);    
      map.renderSync();    
      exportButton.disabled = false;
      document.body.style.cursor = 'auto';
    } else {
      onTilesLoaded  = _export.MapToPDF(canvas,$rootScope.filename);
      loading = 0;          
      map.setSize(size);
      map.getView().fit(extent, size);    
      map.renderSync();    
      exportButton.disabled = false;
      document.body.style.cursor = 'auto';
    }
  }, 100);

}, false);
/*********************** FIN PDF ***********************************/

/*********************** PNG ***********************************/
document.getElementById('export_png').addEventListener('click', function() {
  map.once('postcompose', function(event) {
    _export.MapToPNG(event,$rootScope.filename);
  });
  map.renderSync();
});
/*********************** FIN PNG ***********************************/

/*********************** ZIP ***********************************/
document.getElementById('export_zip').addEventListener('click', function() {
  _export.MapToZIP(canvas,$rootScope.filename);
});
/*********************** FIN ZIP ***********************************/


}]);