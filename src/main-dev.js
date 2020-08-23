import './plugins/element.js'
import 'nprogress/nprogress.css'
import './assets/fonts/style.css'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import './assets/global.css'

import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
Vue.use(VueQuillEditor, /* { default global options } */)

import nprogress from 'nprogress'
import Vue from 'vue'
import cookie from 'js-cookie'
import App from './App.vue'
import router from './router/routers'

Vue.config.productionTip = false


axios.defaults.baseURL = 'http://192.168.44.128/v1/'
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if(config.url == 'api/user/login/') return config
    const token = cookie.get('token')
    if (token) {
      nprogress.start()
      config.headers.authorization = 'JWT ' + token  //请求头加上token
    }else{
      router.push({
        path:'/login',replace:true
      })
    }
    return config
  },
  err => {
    return Promise.reject(err.response.status)
  })

// http response 拦截器
axios.interceptors.response.use(
  hander =>{
    nprogress.done()
    return hander
  },error => {
    if(error.response.status == 401){
      cookie.remove('token')
      router.push('/login')
    }
    return Promise.reject(error.response.data)
  }
)

Vue.prototype.axios = axios
//默认host
Vue.prototype.BaseHost = 'http://192.168.44.128:8000'


// 路由守卫
router.beforeEach((to,from,next)=>{
  const token = cookie.get('token')
  if(to.path != '/login'){
    if(!token){
      return next({ path:'/login' + '?next=' + to.path})
    }
  }
  if(to.path == '/login'){
    if(token){
      return next('/')
    }
  }
  return next()
    });

//table组件
Vue.component('tree', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

