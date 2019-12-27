import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { notification } from 'ant-design-vue'
import './index.css'
router.beforeEach((to, from, next) => {
    if (to.path === '/login'){
      next()
    }else {
      if (eval(sessionStorage.isAuth) === true){
        next()
      } else {
        next('/login')
      }
    }
})
Vue.config.productionTip = false;
Vue.prototype.$notification = notification;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
