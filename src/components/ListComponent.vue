<template>
  <div>
    <div class="container mx-auto">
      <!-- 1 -->
      <div
        class="ml-4 mt-6 relative text-bold text-xl text-bold border border-b-gray-200 border-white"
      >
        <div> {{ title }} </div>
        
      </div>
      <div v-show="subtitle" class="ml-4 pb-2 text-sm"> {{ subtitle }} </div>
      <span
        v-show="this.value.length === 0"
        class="m-6 relative pb-2 border border-b-gray-200 border-white"
      >
        콘텐츠가 없습니다.
      </span>
      <div class="flex m-4">
        <input 
          class="mr-2" 
          type="checkbox"
          v-show="select"
          value="all" 
          v-model="allSelected"
          @change="emitEvent('updateSelected',selectedRows)"
        />
        <label for="all" class="text-base">전체</label>
      </div>
      <transition-group tag="ul" type="transition" :name="'list'">
        <li class="option-default" v-for="row in realValue" :key="row.id">
          <div class="flex m-4">
            <div class="mt-4 mr-2">
              <input 
                v-show="select" 
                type="checkbox" 
                v-model="selectedRows"
                :value="row.id"
                :id="row.id"
                @change="emitEvent('updateSelected',selectedRows)"
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
              <!-- <div class="right-0 text-gray-800 text-sm">
                {{ row.date_at }}
              </div> -->
            </div>
            <transition name="slide">
              <div class="absolute right-0 mr-1 mt-4">
                <button
                  class="bg-gray-300 focus:bg-red-300 text-white font-bold w-18 h-9 py-2 px-2 rounded"
                >
                  ...
                </button>
              </div>
            </transition>
          </div>
        </li>
      </transition-group>
      <div class="flex m-4">
        <input 
          class="mr-2" 
          type="checkbox"
          v-show="select"
          value="all" 
          v-model="allSelected"
          @change="emitEvent('updateSelected',selectedRows)"
        />
        <label for="all" class="text-base">전체</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
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
    };
  },
  methods: {
    emitEvent(eventName, item = undefined) {
      this.$emit(
        eventName,
        item
      );
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
