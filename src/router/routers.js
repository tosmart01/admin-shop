import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import index from '../components/index'
import User from '../components/user/userList'
import Perm from '../components/permission/perm'
import Role from '../components/permission/roles'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login},
  {
    path: '/index', component: index, redirect: '/api/user/',children: [
      {path: '/api/user/',component:User},
      {path: '/api/perm/',component:Perm},
      {path: '/api/roles/',component:Role},
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
