<template>
   <q-page class="flex flex-center bg-color">
    <div class="q-pa-md">
      <q-table
        grid
        hide-header
        
        title="Statistics"
        :data="data"
        :columns="columns"
        :filter="filter"
        row-key="name">

      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search A Country">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-auto col-lg-3">
          <q-card>
            <q-card-section>
              <div class="flex flex-center">{{ props.row.name }} ({{ props.row.code }})</div>
            </q-card-section>
            <q-separator />
            <q-list dense>
              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
                <q-item-section>
                  <q-item-label>{{ col.label }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption>{{ col.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>

      </q-table>
    </div>
  </q-page>

</template>

<script>
import axios from 'axios'
import { date } from 'quasar'
export default {
  name: 'Table',
  data () {
    return {
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name (Code)',
          //align: 'left',
          field: row => row.name + ' ('+row.code+')',
          format: val => `${val}`,
          sortable: true
        },{ 
          name: 'population', 
          //align: 'center', 
          label: 'Population', 
          field: row => row.population, 
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)  
        },{ 
          name: 'today_confirmed', 
          label: 'Today Confirmed', 
          field: row => row.today.confirmed, 
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)  
        },{ 
          name: 'today_deaths', 
          label: 'Today Deaths', 
          field: row => row.today.deaths,
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)   
        },{ 
          name: 'confirmed', 
          label: 'Confirmed Case', 
          field: row => row.latest_data.confirmed,
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)    
        },{ 
          name: 'critical', 
          label: 'Critical Case', 
          field: row => row.latest_data.critical,
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)    
        },{ 
          name: 'recovered', 
          label: 'Recovered', 
          field: row => row.latest_data.recovered, 
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'recovery_rate', 
          label: 'Recovery Rate (%)', 
          field: row => row.latest_data.calculated.recovery_rate, 
          format(val){
            if(val !== null){
              return parseInt(`${val}`);
            }else{
              return 0;
            }
          },
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'deaths', 
          label: 'Deaths', 
          field: row => row.latest_data.deaths,
          format: val => parseInt(`${val}`).toLocaleString('en'), 
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'death_rate', 
          label: 'Death Rate (%)', 
          field: row => row.latest_data.calculated.death_rate, 
          format(val){
            if(val !== null){
              return parseInt(`${val}`);
            }else{
              return 0;
            }
          },
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'updated', 
          label: 'Updated At', 
          field: row => row.updated_at, 
          format: val => date.formatDate(val, 'DD/MM/YYYY'),
          sortable: false 
        }
      ],
    data: []
    }
  },
  created() {
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

</style>

<!--V1-->
<!--<template>
   <q-page class="flex flex-center bg-color">
    <div class="q-pa-md">
      <q-table
        :dense="$q.screen.lt.md"
        title="Statistics"
        :data="data"
        :columns="columns"
        :filter="filter"
        row-key="name">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      </q-table>
    </div>
  </q-page>

</template>

<script>
import axios from 'axios'
import { date } from 'quasar'
export default {
  name: 'Table',
  data () {
    return {
      filter: '',
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Name (Code)',
          align: 'left',
          field: row => row.name + ' ('+row.code+')',
          format: val => `${val}`,
          sortable: true
        },{ 
          name: 'population', 
          align: 'center', 
          label: 'Population', 
          field: row => row.population, 
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)  
        },{ 
          name: 'today_confirmed', 
          label: 'Today Confirmed', 
          field: row => row.today.confirmed, 
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)  
        },{ 
          name: 'today_deaths', 
          label: 'Today Deaths', 
          field: row => row.today.deaths,
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)   
        },{ 
          name: 'confirmed', 
          label: 'Confirmed Case', 
          field: row => row.latest_data.confirmed,
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)    
        },{ 
          name: 'critical', 
          label: 'Critical Case', 
          field: row => row.latest_data.critical,
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b)    
        },{ 
          name: 'recovered', 
          label: 'Recovered', 
          field: row => row.latest_data.recovered, 
          format: val => parseInt(`${val}`).toLocaleString('en'),
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'recovery_rate', 
          label: 'Recovery Rate (%)', 
          field: row => row.latest_data.calculated.recovery_rate, 
          format(val){
            if(val !== null){
              return parseInt(`${val}`);
            }else{
              return 0;
            }
          },
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'deaths', 
          label: 'Deaths', 
          field: row => row.latest_data.deaths,
          format: val => parseInt(`${val}`).toLocaleString('en'), 
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'death_rate', 
          label: 'Death Rate (%)', 
          field: row => row.latest_data.calculated.death_rate, 
          format(val){
            if(val !== null){
              return parseInt(`${val}`);
            }else{
              return 0;
            }
          },
          sortable: true, 
          sort: (a, b) => parseInt(a) - parseInt(b) 
        },{ 
          name: 'updated', 
          label: 'Updated At', 
          field: row => row.updated_at, 
          format: val => date.formatDate(val, 'DD/MM/YYYY'),
          sortable: false 
        }
      ],
    data: []
    }
  },
  created() {
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

</style>-->
