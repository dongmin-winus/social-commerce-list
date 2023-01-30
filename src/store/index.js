import Vue from "vue";
import Vuex from "vuex";

import commerceStore from "./module/commerceStore";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    commerceStore,
  },
});
