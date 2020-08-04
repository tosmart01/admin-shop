import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import index from '../components/index'
import User from '../components/user/userList'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login},
  {
    path: '/index', component: index, redirect: '/api/user/',children: [
      {path: '/api/user/',component:User},
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
