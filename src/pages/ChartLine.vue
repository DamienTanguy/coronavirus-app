<template>
    <q-page class="flex flex-center column bg-color">
    	<q-select 
    		outlined 
    		v-model="country" :options="data" option-label="name" 
    		label="Select a Country"         
        	class="input" />
      <!-- the size of the drop-down list is defined in app.scss-->
    	<ChartLine v-bind:country="country"/>
    </q-page>
</template>

<script>
import axios from 'axios'
import ChartLine from 'components/ChartLine.vue'
export default {
  name: 'PageChartLine',
  components: { ChartLine },
  data () {
    return {
      country: {
      	name: "Afghanistan",
      	code:"AF"
      },
      data: []
    }
  },
  mounted() {
    axios.get('https://corona-api.com/countries').then(response => {
      this.data = response.data.data;
      //order by alphabetic order
      this.data.sort(function(a, b){
          if(a.name < b.name) { return -1; }
          if(a.name > b.name) { return 1; }
          return 0;
      })
    })
  }
}
</script>

<style scoped lang="scss">
  
  .bg-color {
    background-color: #e7e8d1;
  }
  .input {
    width: 200px;
    margin: 10px 0;
  }

</style>
