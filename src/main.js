import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vue2Editor from "vue2-editor";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import firebase  from "firebase";
import 'firebase/auth'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Vue2Editor);

import Notifications from 'vue-notification'
 
/*
or for SSR:
import Notifications from 'vue-notification/dist/ssr.js'
*/
 
Vue.use(Notifications)

Vue.config.productionTip = false;

let app;
firebase.auth().onAuthStateChanged(()=>{
  if(!app){
    new Vue({
      router,
      store,
      beforeCreate() { this.$store.commit('initialiseStore');},
      render: (h) => h(App),
    }).$mount("#app");
  }
})


