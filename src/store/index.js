import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navOpen:true,
    user:null,
  },
  mutations: {
    changeNav(state){
      state.navOpen = !state.navOpen;
    },
    setProfileInfo(state,doc){

      state.user = null;
      state.user = doc;
      console.log(state.user);
    },
    initialiseStore(state){
      const userInfo = JSON.parse(localStorage.getItem("user"));
      if(userInfo){
        state.user = null;
        state.user = userInfo;
        console.log(state.user);
      }
    }
  },
  actions: {
    getCurrentUser({commit}){
      const userInfo = JSON.parse(localStorage.getItem("user"));
      commit("setProfileInfo",userInfo);
    },
  },
  modules: {
  }
})
