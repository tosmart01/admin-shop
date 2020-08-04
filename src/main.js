import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/style.css'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://192.168.44.128:8000/'

Vue.prototype.axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
