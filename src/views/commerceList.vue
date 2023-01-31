<template>
  <div>
    <ListComponent
      :title="'나의 공ZONE'"
      :subtitle="'공유 시 최상단의 3개의 소식이 썸네일에 노출됩니다'"
      :select='true'
      v-model="news"
      @updateSelected="updateSelected"
      @updateList="updateList"
      @deleteOne="deleteOne"
    />
    <div 
      class="flex flex-row  bottom-0 fixed inset-x-0"
    >
      <button
          class="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-4 w-2/3"
        >
          공유하기
        </button>
        <!-- <button 
          value="all"
          class="bg-gray-400 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
          v-show="!allSelected"
          @click="selectAll"
        >
          전체 선택
        </button>
        <button
          class="bg-gray-400 hover:bg-bray-500 text-black font-bold py-2 px-4 rounded"
          v-show="allSelected"
          @click="unselectAll"
        >
          전체 해제
        </button> -->
        <button
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 w-1/3"
          @click="deleteSelected"
        >
          선택 삭제
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ListComponent from "../components/ListComponent.vue";
export default {
  components: {
    ListComponent,
  },
  computed: {
    ...mapGetters(["fetchNews", "fetchMeetings", "fetchPhotos"]),
    allSelected: {
      get: function() {
        return this.news.length === this.selectedRows.length;
      },
      set: function(e) {
        this.selectedRows = e ? this.news.map(e => e.id) : [];
      },
    },
    news: {
      get() {
        return this.fetchNews;
      },
      set(news) {
        this.UPDATE_NEWS(news);
      },
    },
    meetings: {
      get() {
        return this.fetchMeetings;
      },
      set(meetings) {
        this.UPDATE_MEETINGS(meetings);
      },
    },
    photos: {
      get() {
        return this.fetchPhotos;
      },
      set(photos) {
        this.UPDATE_PHOTOS(photos);
      },
    },
  },
  mounted() {
  },
  data() {
    return {
      // menuData: [],
      isEditMode: false,
      selectedRows: [],
    };
  },
  methods: {
    ...mapActions(["UPDATE_NEWS", "UPDATE_MEETINGS", "UPDATE_PHOTOS"]),
    updateSelected(selected) {
      this.selectedRows = selected;
    },
    selectAll() {
      this.selectedRows = this.news.map(e => e.id);
    },
    unselectAll() {
      this.selectedRows = [];
    },
    deleteOne(id) {
      this.news = this.news.filter(item => id !== item.id);
    },
    deleteSelected() {
      this.news = this.news.filter(
        (item) => !this.selectedRows.includes(item.id)
      );
      this.selectedRows = [];
    },
    updateList(newList) {
      console.log({newList})
      this.news = [...newList];
    }

  },
};
</script>
<style scoped>
.ghost {
  opacity: 0.1;
  background: #c8ebfb;
}
/* Slide transition using Animation property of CSS */
.slide-enter {
  /* keyframe에 이미 초기 상태를 정의해놔서 여기에 정의 안해도 됨 */
}

.slide-enter-active {
  animation: slide-in 1s ease-out forwards;
  /* forwards = element가 finishing position에 붙어놓음  */
  transition: opacity 0.5s;
}

.slide-leave {
}

.slide-leave-active {
  animation: slide-out 1s ease-out forwards;
  transition: opacity 0.5s;
  opacity: 0;
}

@keyframes slide-in {
  from {
    transform: translateX(20px);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(20px);
  }
}
</style>
