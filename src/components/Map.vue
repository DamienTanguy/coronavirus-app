<template>
  <div>
    <notifications class="notification-position" position="top center"/>
    <div id="map"></div>
    <div id="info"></div>
    <div class="legend">
      <div class="legend_title">Total Cases</div>
      <div v-for="(legend,index) in legend_color" class="row">
        <div :style="GetLegendStyle(index,legend_color)" class="square"></div>
        <span>{{ legend.name.toLocaleString('en') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Notifications from 'vue-notification'
  import 'ol/ol.css';
  import GeoJSON from 'ol/format/GeoJSON';
  import countryFile from '../assets/countries.json'
  import Map from 'ol/Map';
  import VectorLayer from 'ol/layer/Vector';
  import VectorSource from 'ol/source/Vector';
  import View from 'ol/View';
  import {Fill, Stroke, Style, Text} from 'ol/style';
  export default {
    name: 'Map',
    data () {
      return {
        country_data : [],
        legend_range : [],
        total_cases : 0,
        legend_color:[
          {color:'#FFFFFF',name:"No Information"},
          {color:'#99FF99',name:""},//Green 1
          {color:'#FFB266',name:""},//Green 2
          {color:'#FFCC99',name:""},//Orange light
          {color:'#FF9933',name:""},
          {color:'#FF8000',name:""},//Orange dark
          {color:'#FF9999',name:""},//Red light
          {color:'#FF3333',name:""},
          {color:'#FF0000',name:""},//Red dark
        ]

      }
    },
    mounted() {
      this.$notify({
        title: 'Map Loading',
        text: 'Loading the map may take up to 20 seconds',
        duration: 3000
      });
      axios.get('https://corona-api.com/countries').then(response => {
        var country = {};
        for (let i = 0; i < response.data.data.length ; i++) {
          country = response.data.data[i];
          
          //max total cases storage
          if(response.data.data[i].latest_data.confirmed > this.total_cases){
            this.total_cases = response.data.data[i].latest_data.confirmed;
          }

          if(response.data.data[i].name === 'USA'){
            country.name = 'United States of America';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'UK'){
            country.name = 'United Kingdom';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'Côte d\'Ivoire'){
            country.name = 'Ivory Coast';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'S. Korea'){
            country.name = 'South Korea';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'Korea, Democratic People\'s Republic of'){
            country.name = 'North Korea';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'Serbia'){
            country.name = 'Republic of Serbia';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'Czechia'){
            country.name = 'Czech Republic';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'DRC'){
            country.name = 'Democratic Republic of the Congo';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'Congo'){
            country.name = 'Republic of the Congo';
            this.country_data.push(country);
          }else if(response.data.data[i].name === 'Tanzania'){
            country.name = 'United Republic of Tanzania';
            this.country_data.push(country);
          }else{
            this.country_data.push(country);
          }
        }

        //Making of the legend 
        var range = this.total_cases/this.legend_color.length;
        for (let range_index = 0; range_index < this.legend_color.length-1 ; range_index++) {
          this.legend_range.push(range_index*range);
          if(range_index !== 0){
            this.legend_color[range_index].name = parseInt(range_index*range);
          }
        }
        //the last legend name
        this.legend_color[this.legend_color.length-1].name = parseInt(this.total_cases);
        //Determination of the color value
        for (let country_index = 0; country_index < this.country_data.length ; country_index++) {
          let color_index = 0;
          let range_found = false;
          while (range_found === false){
            if(this.country_data[country_index].latest_data.confirmed >= this.legend_range[color_index]){
              color_index++;
            }else{
              this.country_data[country_index].color = this.legend_color[color_index].color;
              range_found = true;
            }
          };
        }

        this.initiateMap();
      })
    },
    methods: {
      GetLegendStyle: function(index,legend_color) {
        var style = {};
          style.backgroundColor = legend_color[index].color;
        return style;
      },
      initiateMap() {
        
        var country_api_data = this.country_data;

        var vectorSource = new VectorSource({
            //url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
            features: new GeoJSON().readFeatures(countryFile,{ featureProjection:'EPSG:3857'}),
            format: new GeoJSON()
          });

        var defaultStyle = new Style({
          fill: new Fill({
            color: 'white',
          }),
          stroke: new Stroke({
            color: 'white',
            width: 1,
          })
        });

        var vectorLayer = new VectorLayer({
          renderMode: 'image',
          source: vectorSource,
          style: styleFunction
        });

        var view = new View({
            center: [0, 0],
            zoom: 1,
          });

        //include the data from API in the features of the shapefile
        //var key = vectorSource.on('change', function(event) {
              vectorLayer.getSource().forEachFeature(function(feature) {
                //var country_name = feature.get('name');

                for (let country_index = 0; country_index < country_api_data.length ; country_index++) {
                  console.log('feature.get(ADMIN)');
                  console.log(feature.get('ADMIN'));
                  if(country_api_data[country_index].name === feature.get('ADMIN')/*feature.get('name')*/){
                    //LIMITED STAK CALL
                    //feature.set('country_name', country_api_data[country_index].name);
                    //feature.set('code', country_api_data[country_index].code);
                    feature.set('population', country_api_data[country_index].population);
                    //feature.set('new_cases', country_api_data[country_index].today.confirmed);
                    //feature.set('new_deaths', country_api_data[country_index].today.deaths);
                    feature.set('total_cases', country_api_data[country_index].latest_data.confirmed);
                    feature.set('total_deaths', country_api_data[country_index].latest_data.deaths);
                    feature.set('color', country_api_data[country_index].color);
                  }
                }
              });
          //});

        // the style function returns an array of styles for the given feature and resolution.
        // Return null to hide the feature.
        function styleFunction(feature, resolution) {
            if(feature.get('color')){

              var style = new Style({
                fill: new Fill({
                  color: feature.get('color')
                }),
                stroke: new Stroke({
                  color: '#A0A0A0',
                  width: 1,
                })
              });

              return [style];
            }else{
              return [defaultStyle];
            }
        }
        var map = new Map({
          layers: [vectorLayer],
          target: 'map',
          view: view,
        });

        //Hover event
        map.on('pointermove', function (evt) {
        if (evt.dragging) {
          return;
        }
          var pixel = map.getEventPixel(evt.originalEvent);
          var highlight;
          var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
          });

          var info = document.getElementById('info');
          if (feature) {
            document.getElementById("info").style.display = "block";
            info.innerHTML = '<p class="no-margin">' + 'Country'+' : '+ feature.get('ADMIN')/*feature.get('name')*/ + '</p>';
            
            if(feature.values_.color){
              info.innerHTML += '<p class="no-margin">' + 'Population'+':' + parseInt(feature.get('population')).toLocaleString('en') + '</p>';
              //info.innerHTML += '<p class="no-margin">' + 'New Cases'+':' + parseInt(feature.get('new_cases')).toLocaleString('en') + '</p>';
              //info.innerHTML += '<p>' + 'New Deaths'+':' + feature.get('new_deaths') + '</p>';
              info.innerHTML += '<p class="no-margin">' + 'Total Cases'+':' + parseInt(feature.get('total_cases')).toLocaleString('en') + '</p>';
              info.innerHTML += '<p class="no-margin">' + 'Total Deaths'+':' + parseInt(feature.get('total_deaths')).toLocaleString('en') + '</p>';
            }else{
              info.innerHTML += '<p class="no-margin">' + 'Information'+':' + '/' + '</p>';
            }

          } else {
            info.innerHTML = '&nbsp;';
            document.getElementById("info").style.display = "none";
          }

        });

      }
    }
  };
</script>

<style>
  .notification-position {
    margin-top: 70px;
  }
  .vue-notification {
    color: #212121;
    background: #33DAFF;
    border: 1px solid #979494;
    border-radius: 10px;
  }
  .notification-title, .notification-content {
    text-align: center;
  }
  .bg-color {
    background-color: #e7e8d1;
  }
  #map {
    position: absolute;
    margin: 0;
    padding: 0;
    height: 92%;
    width: 100%;
    background-color: #33DAFF;  
  }
  #info {
    background-color: #c6c6c66b;
    font-size: 10px;
    color: #212121;
    z-index: 100;
    position: fixed;
    bottom: 5px;
    left: 50%;
    border: 1px solid #979494;
    border-radius: 10px;
    padding: 5px;
  }
  #info > p {
    margin: 0px;
  }
  .no-margin {
    margin: 0px;
  }
  .legend {
    background-color: #33daff75;
    z-index: 100;
    position: fixed;
    bottom: 5px;
    right: 3%;
    font-size: 10px;
    border: 1px solid #979494;
    border-radius: 10px;
    padding: 5px;
  }
  .legend_title {
    text-align: center;
  }
  .square {
    height: 10px;
    width: 10px;
    margin:2px;
  }

    @media only screen and (max-device-width: 530px) {
    #info {
      left: 3%;
    }
  }

</style>
