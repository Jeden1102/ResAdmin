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
//waiter
import Res from "../views/Res.vue";
import Stats from "../views/Stats.vue";
import Skiba from "../views/Skiba.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/worktime",
    name: "WorkTime",
    component: WorkTime,
  },
  {
    path: "/Profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  //admin routes
  {
    path: "/Waiters",
    name: "Waiters",
    component: Waiters,
  },
  {
    path: "/Menu",
    name: "Menu",
    component: Menu,
  },
  {
    path: "/View",
    name: "View",
    component: ResView,
  },
  //waiter
  {
    path: "/Restaurant",
    name: "Res",
    component: Res,
  },
  {
    path: "/Skiba",
    name: "Skiba",
    component: Skiba,
  },
  {
    path: "/Stats",
    name: "Stats",
    component: Stats,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
