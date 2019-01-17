import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store/store'
import _ from 'lodash'
import '@/utils/storage'
import 'normalize.css/normalize.css'
import 'animate.css'
import '@/styles/index.scss'
import '@/icons'
import GeminiScrollbar from 'vue-gemini-scrollbar'

Vue.use(GeminiScrollbar)
Vue.config.productionTip = false
Vue.prototype._ = _
// register global utility filters.
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
