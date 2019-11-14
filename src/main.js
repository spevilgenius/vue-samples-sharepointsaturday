import '@babel/polyfill'
import Vue from 'vue'
import './dashboard'
import App from './App.vue'
import router from './router'
import store from './store/store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(far, fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import jquery from 'jquery'
Object.defineProperty(Vue.prototype, '$jQuery', { value: jquery })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
