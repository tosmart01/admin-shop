import Vue from 'vue'
import {
  Button, FormItem, Form, Input, Icon, Image, Message,
  Menu, Submenu, MenuItemGroup, MenuItem, Container, Header
  , Aside, Main, Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination, Dialog, Select, MessageBox,
  Option, Tag, Checkbox, CheckboxGroup, Tree, Cascader, Alert,
  Tabs,TabPane,Step,Steps,Upload,Timeline,TimelineItem
} from 'element-ui'


Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(Upload)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tree)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Button)
Vue.use(Tag)
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

