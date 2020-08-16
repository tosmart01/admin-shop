import Vue from 'vue'
import App from './App.vue'
import router from './router/routers'
import axios from 'axios'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/style.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://192.168.44.128:8000/'
//table组件
Vue.component('tree', ZkTable)

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if(config.url == 'api/user/login/') return config
    const token = window.localStorage.getItem('token')
    if (token ) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.authorization = 'JWT ' + token  //请求头加上token
    }else{
      Vue.$router.push({
        path:'/login',replace:true
      })
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器



// 路由守卫
router.beforeEach((to,from,next)=>{

  next()
    });



Vue.prototype.axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
