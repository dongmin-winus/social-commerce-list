<template>
  <div>
    <div
      class="m-4 mt-6 mb-3 relative text-bold text-xl text-bold pb-2 border border-b-gray-200 border-white"
    >
      <!-- <transition name="slide">
        <div
          class="right-0 absolute text-sm text-gray-400 rounded"
          @click="enterEditMode"
          v-show="!isEditMode"
        >
          편집
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="inline-block w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </transition> -->
    </div>
    <ListComponent
      :section="'나의 공ZONE'"
      :groupName="'news'"
      v-model="news"
      @deleteClick="deleteFromList"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ListComponent from "~/components/ListComponent.vue";
const WEB_URL = process.env.VUE_APP_WEB_URL;
const MOBILE_URL = process.env.VUE_APP_MOBILE_URL;
export default {
  components: {
    ListComponent,
  },
  computed: {
    ...mapGetters(["fetchNews", "fetchMeetings", "fetchPhotos"]),
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
    // this.menuData = [
    //   {
    //     id: 0,
    //     section: "마을소식",
    //     groupName: "news",
    //     contents: this.news,
    //   },
    //   {
    //     id: 1,
    //     section: "마을모임",
    //     groupName: "meetings",
    //     contents: this.meetings,
    //   },
    //   {
    //     id: 2,
    //     section: "마을포토",
    //     groupName: "photos",
    //     contents: this.photos,
    //   },
    // ];
  },
  data() {
    return {
      // menuData: [],
      isEditMode: false,
    };
  },
  // mixins: [dataFetchingMixin],
  methods: {
    ...mapActions(["UPDATE_NEWS", "UPDATE_MEETINGS", "UPDATE_PHOTOS"]),
    /**
     * 편집모드 진입
     */
    enterEditMode() {
      this.isEditMode = true;
    },
    /**
     * 카카오 공유하기 피드
     */
    sendKakaoFeed() {
      const content = this.makeShareList()[0] || undefined;
      if (!content) {
        alert("리스트 공유시 1개 이상의 콘텐츠가 필요합니다.");
        return;
      }
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: content.title,
          description: content.date_at,
          imageUrl: "https://picsum.photos/200/300",
          link: {
            mobileWebUrl: `${MOBILE_URL}/myWallet`,
            webUrl: `${WEB_URL}/myWallet`,
          },
        },
        social: {
          likeCount: 286,
          commentCount: 45,
          sharedCount: 845,
        },
        buttons: [
          {
            title: "자세히 보기",
            link: {
              mobileWebUrl: `${MOBILE_URL}/myWallet`,
              webUrl: `${WEB_URL}/myWallet`,
            },
          },
        ],
        serverCallbackArgs: {
          freetownId: "emthrology",
        },
      });
    },
    /**
     * 카카오 공유하기 리스트
     */
    sendKakaoList() {
      const content = this.makeShareList();
      if (content.length < 2) {
        alert("리스트 공유시 2개 이상의 콘텐츠가 필요합니다.");
        return;
      }
      const listContents = content.slice(0, 3).map((item) => ({
        title: item.title,
        description: item.date_at,
        imageUrl: "https://picsum.photos/200/300",
        link: {
          mobileWebUrl: `${MOBILE_URL}/myWallet`,
          webUrl: `${WEB_URL}/myWallet`,
        },
      }));
      window.Kakao.Share.sendDefault({
        objectType: "list",
        headerTitle: "자유마을 소식",
        headerLink: {
          mobileWebUrl: `${MOBILE_URL}/myWallet`,
          webUrl: `${WEB_URL}/myWallet`,
        },
        contents: [...listContents],
        buttons: [
          {
            title: "자세히 보기",
            link: {
              mobileWebUrl: `${MOBILE_URL}/myWallet`,
              webUrl: `${WEB_URL}/myWallet`,
            },
          },
        ],
        serverCallbackArgs: {
          freetownId: "emthrology",
        },
      });
    },
    /**
     * @return Array
     */
    makeShareList() {
      return [...this.news, ...this.meetings, ...this.photos];
    },
    /**
     * 리스트에서 지우고 스토어 뮤테이션 발생
     */
    deleteFromList(groupName, id) {
      // const newList = this.fetchContents.filter((row) => row.id !== id);
      // this.UPDATE_CONTENTS(newList);
      //현재 뮤테이션은 클라이언트 스토어만 변경됨, 서버와 fetching 필요함(saveContents() 메서드 참고)
      let newList;
      switch (groupName) {
        case "news":
          newList = this.news.filter((row) => row.id !== id);
          this.UPDATE_NEWS(newList);
          break;
        case "meetings":
          newList = this.meetings.filter((row) => row.id !== id);
          this.UPDATE_MEETINGS(newList);
          break;
        case "photos":
          newList = this.photos.filter((row) => row.id !== id);
          this.UPDATE_PHOTOS(newList);
          break;
        default:
          break;
      }
    },
    /**
     * delete나 순서를 변경후 저장한 현재 상태를 저쟝하는 기능
     * TODO 저장시 서버와 통신 필요 (뮤테이션시 일일이 저장하지말고 한꺼번에 통신해야할듯 w/ promise.All)
     */
    saveContents() {
      this.isEditMode = false;
    },
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
