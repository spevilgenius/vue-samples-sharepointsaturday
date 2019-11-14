import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/bootstrap/dashboard.scss'

Vue.use(BootstrapVue)
Vue.use(ElementUI, { locale })
