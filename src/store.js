  import Vue from 'vue'
  import Vuex from 'vuex'

  Vue.use(Vuex)

  export default new Vuex.Store({
    state: {
      /**
       * 侧导航是否关闭
       */
      menuCollapsed: false,
      /**
       * 是否首页
       */
      isHome: false,
      /**
       * 面包屑数据
       */
      breadcrumb: [],
      /**
       * 是否登陆
       */
      isAuth: false,
      /**
       * 权限组件
       */
      components: [],
      /**
       *权限按钮
       */
      buttons: [],
      /**
       * 是否启用权限
       */
      isAuthority: true
    },
    mutations: {
      changeCollapsed (state) {
        state.menuCollapsed = !state.menuCollapsed
      },
      changeBreadcrumb (state, value) {
        state.breadcrumb = value
      },
      openHome (state) {
        state.isHome = true
      },
      closeHome (state) {
        state.isHome = false
      },
      changeAuth (state, value) {
        state.isAuth = value
      },
      addComponents (state, value) {
        state.components.push(value)
      },
      addButtons (state, value) {
        state.buttons.push(value)
      },
      restComponentsAndButtons (state) {
        state.components = []
        state.buttons = []
      },
      restState (state) {
        state.menuCollapsed = true
        state.isHome = false
        state.breadcrumb = []
        state.isAuth = false
        state.components = []
        state.buttons = []
        state.isAuthority = true
      }
    },
    actions: {
      changeCollapsedFun (context) {
        context.commit('changeCollapsed')
      },
      changeBreadcrumbFun (context, value) {
        context.commit('changeBreadcrumb', value)

      },
      openHomeFun (context) {
        context.commit('openHome')
      },
      closeHomeFun (context) {
        context.commit('closeHome')
      },
      changeAuthFun (context, value) {
        context.commit('changeAuth', value)
      },
      addComponentsFun (context, value) {
        context.commit('addComponents', value)
      },
      addButtonsFun (context, value) {
        context.commit('addButtons', value)
      },
      restComponentsAndButtonsFun (context) {
        context.commit('restComponentsAndButtons')
      },
      restStateFun (context) {
        context.commit('restState')
      }
    },
    getters: {
      getMenuCollapsed: state => {
        return state.menuCollapsed
      }
    }
  })
