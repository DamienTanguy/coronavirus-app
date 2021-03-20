<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-scarlet">

        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>Covid-19 Statistics</q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :content-style="{ backgroundColor: '#b6cdbd' }">
      <q-list>
        <q-item-label header class="text-grey-8"> Menu </q-item-label>
        <Menu
          v-for="link in menuLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Menu from 'components/Menu.vue'

const linksData = [
  {
    title: 'Home',
    caption: 'Globale Statistics',
    icon: 'home',
    to: '/'
  },
  {
    title: 'Maps',
    caption: 'Coming Soon',
    icon: 'public',
    to: '/'
  },
  {
    title: 'Table',
    caption: 'Statistics by country',
    icon: 'table_rows',
    to: '/table'
  },
  {
    title: 'Top 10',
    caption: 'Highest number of cases & deaths',
    icon: 'leaderboard',
    to: '/top10'
  },
  {
    title: 'Timeline',
    caption: 'Historical of positive, active & deaths cases ',
    icon: 'show_chart',
    to: '/timeline'
  },
  {
    title: 'About',
    caption: 'Data Source',
    icon: 'info',
    to: '/about'
  }
];

export default {
  name: 'MainLayout',
  components: { Menu },
  data () {
    return {
      leftDrawerOpen: false,
      menuLinks: linksData
    }
  }
}
</script>

<style scoped lang="scss">
  
  .bg-scarlet {
    background-color: #b85042;
  }
  /*.bg-peacock-blue {
    background-color: #a7beae;
  }*/

</style>
