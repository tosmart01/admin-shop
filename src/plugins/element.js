import Vue from 'vue'
import {Button, FormItem, Form, Input, Icon, Image, Message,
  Menu, Submenu, MenuItemGroup, MenuItem,Container,Header
  ,Aside,Main,Breadcrumb,BreadcrumbItem,Card,Row,Col,
  Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Select,MessageBox,
Option} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

