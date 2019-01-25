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
import {
  Dialog,
  MessageBox,
  Message,
  Popover,
  Input,
  Button,
  Form,
  FormItem
} from 'element-ui'
import VueLazyload from 'vue-lazyload'
import logo_link from '@/assets/logo_link_default@2x.png'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: logo_link,
  loading: logo_link,
  attempt: 1
})
Vue.use(GeminiScrollbar)
Vue.config.productionTip = false
Vue.prototype._ = _

Vue.use(Dialog)
Vue.use(Popover)
Vue.use(Input)
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
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
