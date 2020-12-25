import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    collpsed: true,
    refreshRouteKey: 1,
    currentProject: '',
    //baseurl: 'http://192.168.20.93:5000/',
    baseurl: 'http://content.dianbb.cn/'
  },
  mutations: {
    changeCollpsed(state,newvalue){
      state.collpsed = newvalue
    },
    changeRefreshRouteKey(state,newvalue){
      state.refreshRouteKey = newvalue
    },
    changeCurrentProject (state,newvalue) {
      state.currentProject = newvalue
    }
  },
  actions: {
  },
  modules: {
  }
})
