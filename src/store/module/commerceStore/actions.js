export default {
  UPDATE_LIST({ commit }, listItems) {
    commit("SET_LIST", listItems);
  },
  UPDATE_CONTENTS({ commit }, contents) {
    commit("SET_CONTENTS", contents);
  },
  UPDATE_NEWS({ commit }, news) {
    commit("SET_NEWS", news);
  },
  UPDATE_MEETINGS({ commit }, meetings) {
    commit("SET_MEETINGS", meetings);
  },
  UPDATE_PHOTOS({ commit }, photos) {
    commit("SET_PHOTOS", photos);
  },
};
