<template>
  <div>
    <div class="container mx-auto pb-8">
      <div
        class="ml-4 mt-6 relative text-bold text-xl text-bold border border-b-gray-200 border-white"
      >
        <div> {{ title }} </div>
      </div>
      <div v-show="subtitle" class="ml-4 pb-2 text-sm"> {{ subtitle }} </div>

      <!-- TODO 디폴트 화면 필요함 스팬 대신으로 -->
      <span
        v-show="this.value.length === 0"
        class="m-6 relative pb-2 border border-b-gray-200 border-white"
      >
        콘텐츠가 없습니다.
      </span>
      <div class="flex ml-2 m-4" v-show="select && this.value.length !== 0">
        <input 
          class="mr-2" 
          type="checkbox"
          value="all" 
          v-model="allSelected"
          @change="$emit('updateSelected',selectedRows)"
        />
        <label for="all" class="text-base">전체</label>
      </div>
      <transition-group tag="ul" type="transition" :name="'list'">
        <li class="option-default" v-for="row in realValue" :key="row.id">
          <div class="flex p-2 border border-b-gray-200 border-white ">
            <div class="mt-6 mr-4">
              <input 
                v-show="select" 
                type="checkbox" 
                v-model="selectedRows"
                :value="row.id"
                :id="row.id"
                @change="$emit('updateSelected',selectedRows)"
              >
            </div>
            <div class="flex-shrink-0 sm:mb-0 mr-4">
              <img
                class="w-20 h-20 border border-gray-300 bg-white text-gray-300"
                src="https://picsum.photos/200/300"
              />
            </div>
            <div>
              <p class="text-md text-gray-800 font-semibold mt-1 p-0">
                {{ row.title }}
              </p>
              <div class="right-0 text-gray-800 text-sm">
                {{ row.date_at }}
              </div>
            </div>
            <transition name="slide">
              <div class="absolute right-0 mr-1 mt-4">
                <button
                  class="bg-gray-300 focus:bg-red-300 text-white font-bold w-18 h-9 py-2 px-2 rounded"
                  @click="handleClick($event,row)"
                >
                  ...
                </button>
              </div>
            </transition>
          </div>
        </li>
      </transition-group>
      <div class="flex ml-2 m-4" v-show="select && this.value.length !== 0">
        <input 
          class="mr-2" 
          type="checkbox"
          value="all" 
          v-model="allSelected"
          @change="$emit('updateSelected',selectedRows)"
        />
        <label for="all" class="text-base">전체</label>
      </div>
    </div>

    <VueSimpleContextMenu 
      element-id="threeDotMenu"
      :options="options"
      ref="contextMenu"
      @option-clicked="optionClicked"
    />
  </div>
</template>

<script>
import VueSimpleContextMenu from 'vue-simple-context-menu'
export default {
  components: {
    VueSimpleContextMenu
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
      default: "group",
    },
    select: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    isEditMode: {
      type: Boolean,
      default: null,
    },
  },
  watch: {
    value() {
      this.selectedRows = [];
    }
  },
  computed: {
    realValue() {
      if (this.value) return this.value;
      else return [];
    },
    allSelected: {
      //getter
      get: function() {
        return this.value.length === this.selectedRows.length;
      },
      //setter
      set: function(e) {
        this.selectedRows = e ? this.value.map(item => item.id) : [];
      },
    },
  },
  data() {
    return {
      slowDown: false,
      drag: false,
      selectedRows:[],
      options: [
        {
          name: '한 줄 위로 이동',
          slug: 'one-line-up',
        },
        {
          name: '한 줄 아래로 이동',
          slug: 'one-line-down',
        },
        {
          name: '가장 위로 이동',
          slug: 'top-up',
        },
        {
          name: '가장 아래로 이동',
          slug: 'bottom-down',
        },
        {
          name: '삭제',
          slug: 'remove',
        },
      ],
    };
  },
  methods: {
    handleClick(event,item) {
      this.$refs.contextMenu.showMenu(event, item);
    },
    optionClicked(event) {
      let newList = this.value;
      const targetIdx = this.value.findIndex(e => e.id === event.item.id);
      if((event.option.slug == 'one-line-up' || event.option.slog == 'top-up') && targetIdx < 1 ) {
        //TODO 모달로 변경
        alert("현재 제일 위에 있습니다.")
        return;
      }
      if((event.option.slug == 'one-line-down' || event.option.slog == 'bottom-down') && targetIdx === this.value.length-1) {
        alert("현재 제일 아래에 있습니다.")
        return;
      }      
      switch(event.option.slug) {
        case 'one-line-up':
          [newList[targetIdx - 1],newList[targetIdx]]  = [newList[targetIdx],newList[targetIdx - 1]];
          this.$emit('updateList',newList)
          break;
        case 'one-line-down':
          [newList[targetIdx],newList[targetIdx + 1]]  = [newList[targetIdx + 1],newList[targetIdx]];
          this.$emit('updateList',newList)
          break;
        case 'top-up':
          newList = [
            this.value[targetIdx],
            ...this.value.filter((e,index) => index !== targetIdx)
          ];
          this.$emit('updateList',newList)
          break;
        case 'bottom-down':
          newList = [
            ...this.value.filter((e,index) => index !== targetIdx),
            this.value[targetIdx]
          ];
          this.$emit('updateList',newList)
          break;
        case 'remove':
          this.$emit('deleteOne', this.value[targetIdx].id);
          break;
      }
    },

  },
};
</script>

<style>
/* @import "../assets/custom.css"; */
/* .option-default {
    @apply cursor-auto;
  } */

  .option-default:nth-child(-n+3) {
    /* background: rgb(254, 159, 224) */
    @apply bg-pink-200;
  }
.list-move {
  transition: transform 0.3s;
}
.list-enter-active {
  animation: slide-in 0.3s ease-out forwards;
  /* forwards = element가 finishing position에 붙어놓음  */
  transition: opacity 0.2s;
}

.list-leave-active {
  animation: slide-out 0.3s ease-out forwards;
  transition: opacity 0.2s;
  opacity: 0;
  /* @apply absolute transform-gpu transition duration-1000; */
}
.list-leave {
  @apply opacity-100 translate-x-0 transition duration-300;
}

.list-leave-to {
  @apply opacity-0 -translate-x-full transition duration-300;
}

/* Slide transition using Animation property of CSS */
.slide-enter {
  /* keyframe에 이미 초기 상태를 정의해놔서 여기에 정의 안해도 됨 */
}

.slide-enter-active {
  animation: slide-in 0.3s ease-out forwards;
  /* forwards = element가 finishing position에 붙어놓음  */
  transition: opacity 0.2s;
}

.slide-leave {
}

.slide-leave-active {
  animation: slide-out 0.3s ease-out forwards;
  transition: opacity 0.2s;
  opacity: 0;
}

@keyframes slide-in {
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slide-out {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(20px);
  }
}
</style>
