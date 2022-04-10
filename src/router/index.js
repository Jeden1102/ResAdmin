import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import WorkTime from "../views/WorkTime.vue";
import Profile from "../views/Profile.vue";
import Login from "../views/Login.vue";
//admin routes
import Waiters from "../views/Waiters.vue";
import Menu from "../views/Menu.vue";
import ResView from "../views/ResView.vue";
import SalesInfo from "../views/SalesInfo.vue";
//waiter
import Res from "../views/Res.vue";
import Stats from "../views/Stats.vue";
import NotFound from "../views/NotFound.vue";
import Delivery from "../views/Delivery.vue";
import store from "../store/index";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta:{
      title:"Home",
      requiresAdmin:false,
      requiresAuth: true,
    }
  },
  {
    path: "/worktime",
    name: "WorkTime",
    component: WorkTime,
    meta:{
      title:"WorkTime",
      requiresAdmin:false,
      requiresAuth: true,
    }
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
    meta:{
      title:"Profile",
      requiresAdmin:false,
      requiresAuth: true,
    }
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
    meta:{
      title:"Login",
      requiresAdmin:false,
      requiresAuth: false,
    }
  },
  {
    path: "/Delivery",
    name: "Delivery",
    component: Delivery,
    meta:{
      title:"Delivery",
      requiresAdmin:false,
      requiresAuth: false,
    }
  },
  //admin routes
  {
    path: "/Waiters",
    name: "Waiters",
    component: Waiters,
    meta:{
      title:"Waiters",
      requiresAdmin:true,
      requiresAuth: true,
    }
  },
  {
    path: "/SalesInfo",
    name: "SalesInfo",
    component: SalesInfo,
    meta:{
      title:"SalesInfo",
      requiresAdmin:true,
      requiresAuth: true,
    }
  },
  {
    path: "/Menu",
    name: "Menu",
    component: Menu,
    meta:{
      title:"Menu",
      requiresAdmin:true,
      requiresAuth: true,
    }
  },
  {
    path: "/View",
    name: "View",
    component: ResView,
    meta:{
      title:"View",
      requiresAdmin:true,
      requiresAuth: true,
    }
  },
  //waiter
  {
    path: "/Restaurant",
    name: "Res",
    component: Res,
    meta:{
      title:"Restaurant",
      requiresAdmin:false,
      requiresAuth: true,
    }
  },
  {
    path: "/Stats",
    name: "Stats",
    component: Stats,
    meta:{
      title:"Stats",
      requiresAdmin:false,
      requiresAuth: true,
    }
  },
  { path: "*", component: NotFound }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to,from,next)=>{
  document.title = `${to.meta.title} | Food Penguin`;
  return next();
})
router.beforeEach(async (to,from,next)=>{
  store.dispatch('getCurrentUser');
  let user =  store.state.user;
  let admin = false;
  if(user){
    admin = store.state.user.isAdmin;
  }
  if(admin){
    return next();
  }

  if(to.meta.requiresAuth){
    if(to.meta.requiresAdmin){
      if(!admin){
        return next({ name: 'Home' });
      }else{
        return next();
      }
    }
    if(user){
      return next();
    }else{
      return next({ name: 'Login' });
    }
  }

  next();
})

export default router;
