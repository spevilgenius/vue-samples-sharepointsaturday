import Vue from 'vue'
import Vuex from 'vuex'
import * as milestone from '@/store/modules/milestone.js'
import * as notification from '@/store/modules/notification.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    milestone,
    notification
  }
})
