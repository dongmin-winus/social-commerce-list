import Vue from "vue";
import VueRouter from "vue-router";

// import { store } from "../store/index.js";``
import commerceList from "../views/commerceList.vue";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/commerceList",
    },

    {
      path: "/commerceList",
      name: "/commerceList",
      component: commerceList,
    },
  ],
});
