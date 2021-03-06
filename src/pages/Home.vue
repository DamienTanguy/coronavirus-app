<template>
  <q-page class="flex flex-center bg-color">
    <div class="q-pa-md mainbox">
    	<Indicator class="main-indicator"
          v-for="country_nb in countryStatistics"
          :key="country_nb.type"
          v-bind="country_nb"
        />
    	<div class="box">
    		<Indicator
	          v-for="stats in globalStatistics"
	          :key="stats.type"
	          v-bind="stats"
	        />
    	</div> 
	</div>

  </q-page>
</template>

<script>
import Indicator from 'components/Indicator.vue'
import axios from 'axios'

export default {
  name: 'HomePage',
  components: { Indicator },
  data() {
    return {
		countryStatistics: [],
		globalStatistics: []
    }
  },
  mounted() {
    var country_nb = 0;
    var confirmed_nb = 0;
    var revovered_nb = 0;
    var critical_nb = 0;
    var death_nb = 0;
    axios.get('https://corona-api.com/countries').then(response => {
        //Calculation of the indicator
        response.data.data.forEach(element => {
        	if(element.latest_data.confirmed !== 0){
        		country_nb++;
        		confirmed_nb += element.latest_data.confirmed;
        		revovered_nb += element.latest_data.recovered;
        		critical_nb += element.latest_data.critical;
        		death_nb += element.latest_data.deaths;
        	}
        });

        this.countryStatistics = [
		  {
		    icon: 'travel_explore',
		    type: 'Countrie',
		    value: country_nb,
		    backgroundColor: 'background-color:#4a5568'
		  }
		];

		this.globalStatistics = [
		  {
		    icon: 'coronavirus',
		    type: 'Confirmed',
		    value: confirmed_nb,
		    backgroundColor: 'background-color:#8f9fb5'
		  },
		  {
		    icon: 'insert_emoticon',
		    type: 'Recovered',
		    value: revovered_nb,
		    backgroundColor: 'background-color:#42b57f'
		  },
		  {
		    icon: 'sick',
		    type: 'Critical',
		    value: critical_nb,
		    backgroundColor: 'background-color:#e39342'
		  },
		  {
		    icon: 'clear',
		    type: 'Deaths',
		    value: death_nb,
		    backgroundColor: 'background-color:#e55e5e'
		  }
		];
      
    })
  }
}
</script>

<style scoped lang="scss">
	
	.bg-color {
		background-color: #e7e8d1;
	}
	div {
		line-height: 1.25;
		font-size: 1rem;
		font-weight: 700;
	}
	.material-icons {
		font-size: 55px;
	}
	.mainbox {
		display: flex;
		flex-direction: column;
		align-items: center;	
		color: #666666;
		border: 1px solid #b6cdbd;
		background-color: #b6cdbd;
		border-radius: 10px;
	}
	.box {
		display: flex;
	}
	.minibox {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 25px;
		margin: 16px;
		border: 1px solid #b6cdbd;
		border-radius: 10px;
	}
	.main-indicator {
		width: 96%;
	}

</style>
