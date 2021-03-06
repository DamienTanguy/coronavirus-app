<template>
    <q-page class="flex flex-center column bg-color">
    	<q-select 
    		outlined 
    		v-model="datatype" :options="data" option-label="name" 
    		label="Select Information"         
    		transition-show="flip-up" transition-hide="flip-down"
        	class="input" />
    	<ChartBar v-bind:datatype="datatype"/>
    </q-page>
</template>

<script>
import ChartBar from 'components/ChartBar.vue'
export default {
  name: 'PageChartBar',
  components: { ChartBar },
  data () {
    return {
      datatype: {
      	id:1,
      	name:'Top 10 - New Cases',
  	   	label: 'New Cases'
      },
      data: [
        {
  	    	id:1,
  	    	name:'Top 10 - New Cases',
  	    	label: 'New Cases'
        },
        {
        	id:2,
        	name:'Top 10 - New Deaths',
	    	  label: 'New Deaths'
        },
        {
        	id:3,
        	name:'Top 10 - Total Cases',
	    	  label: 'Total Cases'
        },
        {
        	id:4,
        	name:'Top 10 - Total Deaths',
	    	  label: 'Total Deaths'
        }
      ]
    }
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
