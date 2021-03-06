<template>
    <q-page class="flex flex-center column bg-color">
    	<q-select 
    		outlined 
    		v-model="country" :options="data" option-label="name" 
    		label="Select a Country"         
        	class="input" />
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
