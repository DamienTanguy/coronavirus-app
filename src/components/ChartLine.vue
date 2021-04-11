<template>
    <q-page class="flex flex-center">
        <q-page class="chart-line-container">
          <canvas id="myChartTimeline"></canvas>
        </q-page>
    </q-page>
</template>

<script>
import axios from 'axios'
import { date } from 'quasar'
import Chart from 'chart.js';

export default {
  name: 'ChartTimeline',
  props: {
    country: {
      type: Object
    }
  },
  data () {
    return {
      timeline_data : [],
      date_data : [],
      active_cases : [],
      confirmed_cases : [],
      death_cases : [],
      myChartTimeline : null
    }
  },
  mounted() {
      this.createChart();
  },
  watch: {
    country: function(country) {
        this.updateData(this.myChartTimeline,country);
    }
  },
  methods: {
    createChart() { //Creation of the chart with Afghanistan by default

      axios.get('https://corona-api.com/countries/'+this.country.code).then(response => {
        this.timeline_data = response.data.data.timeline;

        //order by date
        this.timeline_data.sort(function(a, b){
            if(a.date < b.date) { return -1; }
            if(a.date > b.date) { return 1; }
            return 0;
        });

        //Storage of the data for the axis
        this.timeline_data.forEach(element => {
          this.date_data.push(element.date);
          this.active_cases.push(element.active);
          this.confirmed_cases.push(element.confirmed);
          this.death_cases.push(element.deaths);
        });

        //Storage & filter duplicate of the date 
        let date_label_duplicate = [];
        let time_label_unique = [];
        this.date_data.forEach(element => {
          if(!time_label_unique.includes(date.formatDate(element, 'MMMM YY'))){
            time_label_unique.push(date.formatDate(element, 'MMMM YY'));
          }
          date_label_duplicate.push(date.formatDate(element, 'MMMM YY'));
        });

        //Building of the chart
        var ctx = document.getElementById('myChartTimeline');

        const data = {
            labels: date_label_duplicate,
            datasets: [{
                label: 'Active Cases',
                data: this.active_cases,
                borderWidth: 4,
                borderColor: 'red',
                fill: false
            },{
                label: 'Total Positive Cases',
                data: this.confirmed_cases,
                borderWidth: 4,
                borderColor: 'blue',
                fill: false
            },{
                label: 'Total Death Cases',
                data: this.death_cases,
                borderWidth: 4,
                borderColor: 'green',
                fill: false
            }]
        }
        const options = {
              //responsive: false,
              //maintainAspectRatio: true,
              //aspectRatio:1,
              title: {
                display: false
              },
              elements: {
                point: {
                  radius: 0
                }
              },
              legend: {
                display: true
              },
              scales: {
                xAxes: [{
                  ticks: {
                      autoSkip: true,
                      maxTicksLimit: time_label_unique.length
                  },
                   gridLines: {
                      display: true
                   },
                   scaleLabel: {
                    display: false
                  }
                }],
                yAxes: [{
                   ticks: {
                      beginAtZero: true, 
                   },
                   gridLines: {
                      display: true
                   },
                   scaleLabel: {
                    display: false
                  }
                }]
              }
        }

        //Screen parameter --> if the screen is mobile, put aspectRatio=1
        //                 --> if the screen is desktop, default parameter
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          options.aspectRatio = 1;
        }

        this.myChartTimeline = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
      });
    },
    updateData(chart,country) {
      //Remove data from the canvas
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.data.datasets[1].data = [];
      chart.data.datasets[2].data = [];

      this.timeline_data = [];
      this.date_data = [];
      this.active_cases = [];
      this.confirmed_cases = [];
      this.death_cases = [];

      axios.get('https://corona-api.com/countries/'+country.code).then(response => {
        this.timeline_data = response.data.data.timeline;
        //console.log(this.timeline_data);

        if(this.timeline_data.length !== 0){

            //order by date
            this.timeline_data.sort(function(a, b){
                if(a.date < b.date) { return -1; }
                if(a.date > b.date) { return 1; }
                return 0;
            });

            chart.options.title.display = false;
            chart.options.legend.display = true;

            //Storage of the data for the axis
            this.timeline_data.forEach(element => {
              this.date_data.push(element.date);
              this.active_cases.push(element.active);
              this.confirmed_cases.push(element.confirmed);
              this.death_cases.push(element.deaths);
            });

            //Storage & filter duplicate of the date 
            let date_label_duplicate = [];
            let time_label_unique = [];
            this.date_data.forEach(element => {
              if(!time_label_unique.includes(date.formatDate(element, 'MMMM YY'))){
                time_label_unique.push(date.formatDate(element, 'MMMM YY'));
              }
              date_label_duplicate.push(date.formatDate(element, 'MMMM YY'));
            });

            //Add data to the canvas
            for (let i = 0; i < this.timeline_data.length; i++) {
              chart.data.datasets[0].data.push(this.active_cases[i]);
              chart.data.datasets[1].data.push(this.confirmed_cases[i]);
              chart.data.datasets[2].data.push(this.death_cases[i]);
            }

            chart.data.labels = date_label_duplicate;
        }else{
          //No data available
          chart.options.title.display = true;
          chart.options.title.text = 'No data available';
          chart.options.legend.display = false;
        }
        chart.update();
      });
      
    }

  }
}
</script>

<style>

  .chart-line-container {
    margin: auto;
    height: 70vh;
    width: 70vw;
  }

  @media only screen and (max-device-width: 640px) {
    .chart-line-container {
      display: flex;
      align-items: center;
      margin: auto;
      width: 100vw;
    }
  }

  @media only screen and (max-device-width: 400px) {
    .chart-line-container {
      display: flex;
      align-items: center;
      margin: auto;
      width: 100vw;
    }
  }

</style>
