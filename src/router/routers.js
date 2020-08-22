import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = ()=>import('../components/login')
const index = ()=>import('../components/index')
const User = ()=>import('../components/user/userList')
const Perm = ()=>import('../components/permission/perm')
const Role = ()=>import('../components/permission/roles')
const Goods = ()=>import('../components/goods/goods')
const GoodsParam = ()=>import('../components/goods/goodsParam')
const GoodsList = ()=>import('../components/goods/goodsList')
const GoodsSteps = ()=>import('../components/goods/goodsSteps')
const Order = ()=>import('../components/order/order')
const Report = ()=>import('../components/report/report')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  { path: '/login', component: Login},
  {
    path: '/index', component: index,redirect: '/api/user',children: [
      {path: '/api/user/',component:User},
      {path: '/api/perm/',component:Perm},
      {path: '/api/roles/',component:Role},
      {path: '/api/goodscate/',component:Goods},
      {path: '/api/goodsparam/',component:GoodsParam},
      {path: '/api/goodslist/',component:GoodsList},
      {path: '/api/goodsSteps/',component:GoodsSteps},
      {path: '/api/orderlist/',component:Order},
      {path: '/api/report/',component:Report},
    ],
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
