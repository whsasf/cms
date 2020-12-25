import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'element-ui/lib/theme-chalk/icon.css'
import CKEditor from 'ckeditor4-vue';
import 'video.js/dist/video-js.css'

Vue.use(CKEditor)

import {Drawer, Button, Form, FormItem, Input, Icon, Select, Option, Message, Menu, MenuItem, Submenu, Tabs, TabPane, Row, Col, Table, Modal, Card, Page, Layout, Sider, Header, Content,Poptip,Upload,Dropdown,DropdownMenu,DropdownItem,DatePicker,RadioGroup,Radio,Spin, BackTop, CheckboxGroup, Checkbox  } from 'view-design'
import 'view-design/dist/styles/iview.css'

Vue.component('i-button', Button)
Vue.component('i-form', Form)
Vue.component('i-formItem', FormItem)
Vue.component('i-input', Input)
Vue.component('i-icon', Icon)
Vue.component('i-select', Select)
Vue.component('i-option', Option)
Vue.component('i-menu', Menu)
Vue.component('i-menuItem', MenuItem)
Vue.component('i-submenu', Submenu)
Vue.component('i-tabs', Tabs)
Vue.component('i-tabPane', TabPane)
Vue.component('i-row', Row)
Vue.component('i-col', Col)
Vue.component('i-table', Table)
Vue.component('i-modal', Modal)
Vue.component('i-card', Card)
Vue.component('i-page', Page)
Vue.component('i-layout', Layout)
Vue.component('i-sider', Sider)
Vue.component('i-header', Header)
Vue.component('i-content', Content)
Vue.component('i-poptip', Poptip)
Vue.component('i-upload', Upload)
Vue.component('i-dropdown', Dropdown)
Vue.component('i-dropdownMenu', DropdownMenu)
Vue.component('i-dropdownItem', DropdownItem)
Vue.component('i-datePicker', DatePicker)
Vue.component('i-radioGroup', RadioGroup)
Vue.component('i-radio', Radio)
Vue.component('i-spin', Spin)
Vue.component('i-drawer', Drawer)
Vue.component('i-backTop', BackTop)
Vue.component('i-checkboxGroup', CheckboxGroup)
Vue.component('i-checkbox', Checkbox)



Vue.prototype.$Message = Message
Vue.prototype.$Message.config({
  top: 50,
  duration: 2
});
Vue.prototype.$Modal =Modal

// axios 请求拦截器，添加 jwt header
axios.interceptors.request.use(function (config) {
  // 添加jwt token
  config.headers.Authorization = 'JWT ' + localStorage.getItem('kwmjWT')
  return config
},
function (error) {
  return Promise.reject(error)
})


// 定义一个响应拦截器, 认证失效， 强制认证
axios.interceptors.response.use(
function (response) {
  // console.log(response)
  return response
},
function (error) {
  // console.log(error.response)
  if (error.response.status === 401) {
    // 删除本地 jwt 相关信息
    localStorage.removeItem('kwmUser') 
    // 重定向到 登录 页面
    console.log(router.currentRoute.path)
    if (router.currentRoute.path !== '/Account/Signin') {
      // 只提示一次,对于连续的 401响应
      Message.error(error.response.data);
      router.push('/Account/Signin')
    }
  } else {
    return Promise.reject(error)
  }
})

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
