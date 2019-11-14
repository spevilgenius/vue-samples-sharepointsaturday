import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from './views/DashboardLayout.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: DashboardLayout,
      props: true
    }
  ]
})
