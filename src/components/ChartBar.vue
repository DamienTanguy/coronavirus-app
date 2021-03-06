<template>
    <q-page class="chart-container">
        <canvas id="myChartBar"></canvas>
    </q-page>
</template>

<script>
import axios from 'axios'
import { date } from 'quasar'
import Chart from 'chart.js';

export default {
  name: 'ChartBar',
  props: {
    datatype: {
      type: Object
    }
  },
  data () {
    return {
      country_list : [],
      country_label : [],
      dataset_data : [],
      title : '',
      myChartBar : null
    }
  },
  mounted() {
    axios.get('https://corona-api.com/countries').then(response => {
      this.country_list = response.data.data;
      this.createChart();
    })
  },
  watch: {
    datatype: function(data_type) {
        this.updateConfigByMutating(this.myChartBar,data_type);
        this.updateData(this.myChartBar,data_type);
    }
  },
  methods: {
    createChart() { //Creation of the chart with New cases by default

      //order to get the top 10 of new cases
      this.country_list.sort(function (a,b){
        return b.today.confirmed - a.today.confirmed;
      });
      //Storage of the data for the axis
      for (let i = 0; i < 10; i++) {
        this.country_label.push(this.country_list[i].name);
        this.dataset_data.push(this.country_list[i].today.confirmed); //new cases
      }
      this.title = 'Top 10 - New Cases ('+ date.formatDate(this.country_list[0].updated_at, 'DD/MM/YYYY') + ')';

      //Selection of 10 raimbow colors
      const colors = [
            'hsla(0,70%,80%,1)',
            'hsla(30,70%,80%,1)',
            'hsla(60,70%,80%,1)',
            'hsla(90,70%,80%,1)',
            'hsla(120,70%,80%,1)',
            'hsla(180,70%,80%,1)',
            'hsla(210,70%,80%,1)',
            'hsla(240,70%,80%,1)',
            'hsla(270,70%,80%,1)',
            'hsla(300,70%,80%,1)'
      ];
      const border_colors = [
            'hsla(0,70%,80%,1)',
            'hsla(30,70%,80%,1)',
            'hsla(60,70%,80%,1)',
            'hsla(90,70%,80%,1)',
            'hsla(120,70%,80%,1)',
            'hsla(180,70%,80%,1)',
            'hsla(210,70%,80%,1)',
            'hsla(240,70%,80%,1)',
            'hsla(270,70%,80%,1)',
            'hsla(300,70%,80%,1)'
      ];

      //Building of the chart
      const ctx = document.getElementById('myChartBar');

      const data = {
            labels: this.country_label,
            datasets: [{
                label: this.datatype.label,
                data: this.dataset_data,
                backgroundColor: colors,
                borderColor: border_colors,
                borderWidth: 2,
                borderSkipped: 'bottom'
            }]
      }
      const options = {
            //maintainAspectRatio: false,
            //aspectRatio:1,
            title: {
              display: true,
              text: this.title
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                 gridLines: {
                    display: false
                 }
              }],
              yAxes: [{
                 ticks: {
                    beginAtZero: true, 
                 },
                 gridLines: {
                    display: true
                 }
              }]
            }
      }

      //Screen parameter --> if the screen is mobile, put aspectRatio=1
      //                 --> if the screen is desktop, default parameter
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        options.aspectRatio = 1;
      }

      this.myChartBar = new Chart(ctx, {
          type: 'bar',
          data: data,
          options: options
      });
    },

    updateConfigByMutating(chart,data_type) {        
      if(data_type.id === 1){ //NEW CASES
          this.title = 'Top 10 - New Cases ('+ date.formatDate(this.country_list[0].updated_at, 'DD/MM/YYYY') + ')';

      }else if(data_type.id === 2){ //NEW DEATHS
          this.title = 'Top 10 - New Deaths ('+ date.formatDate(this.country_list[0].updated_at, 'DD/MM/YYYY') + ')';
      
      }else if(data_type.id === 3){ //TOTAL CASES
          this.title = 'Top 10 - Total Cases';
      
      }else if(data_type.id === 4){ //TOTAL DEATHS
          this.title = 'Top 10 - Total Deaths';
      }

        chart.options.title.text = this.title;
        chart.update();
    },

    updateData(chart,data_type) {
      //Remove data from the canvas
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.data.datasets[0].label = '';

      //Add data to the canvas
      this.country_label = [];
      this.dataset_data = [];

      if(data_type.id === 1){ //NEW CASES
        //order to get the top 10 of new cases
        this.country_list.sort(function (a,b){
          return b.today.confirmed - a.today.confirmed;
        });
        //Storage of the data for the axis
        for (let i = 0; i < 10; i++) {
          chart.data.labels.push(this.country_list[i].name);
          chart.data.datasets[0].data.push(this.country_list[i].today.confirmed); //new cases
        }

      }else if(data_type.id === 2){ //NEW DEATHS
        //order to get the top 10 of new cases
        this.country_list.sort(function (a,b){
          return b.today.deaths - a.today.deaths;
        });
        //Storage of the data for the axis
        for (let i = 0; i < 10; i++) {
          chart.data.labels.push(this.country_list[i].name);
          chart.data.datasets[0].data.push(this.country_list[i].today.deaths); //new deaths
        }
      
      }else if(data_type.id === 3){ //TOTAL CASES
        //order to get the top 10 of new cases
        this.country_list.sort(function (a,b){
          return b.latest_data.confirmed - a.latest_data.confirmed;
        });
        //Storage of the data for the axis
        for (let i = 0; i < 10; i++) {
          chart.data.labels.push(this.country_list[i].name);
          chart.data.datasets[0].data.push(this.country_list[i].latest_data.confirmed); //total cases
        }
      
      }else if(data_type.id === 4){ //TOTAL DEATHS
        //order to get the top 10 of new cases
        this.country_list.sort(function (a,b){
          return b.latest_data.deaths - a.latest_data.deaths;
        });
        //Storage of the data for the axis
        for (let i = 0; i < 10; i++) {
          chart.data.labels.push(this.country_list[i].name);
          chart.data.datasets[0].data.push(this.country_list[i].latest_data.deaths); //total deaths
        }
      }
      chart.data.datasets[0].label = data_type.label;

      chart.update();
    }

  }
}
</script>


<style scoped lang="scss">

  .chart-container {
    margin: auto;
    height: 70vh;
    width: 70vw;
  }

  /*@media only screen and (max-device-width: 1500px) {
    .chart-container {
      display: flex;
      align-items: center;
      margin: auto;
      width: 90vw;
    }
  }*/

  @media only screen and (max-device-width: 640px) {
    .chart-container {
      display: flex;
      align-items: center;
      margin: auto;
      width: 90vw;
    }
  }

  /*#myChartBar {
    height: 100%;
    width: 100%;
  }*/

</style>