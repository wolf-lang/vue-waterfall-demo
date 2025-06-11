<template>
  <div class="waterfall-container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div v-if="refreshing" class="refresh-indicator">刷新中...</div>
    <Waterfall
      :list="list"
      :column="2"
      :gap="8"
      :breakpoints="{ 500: { column: 2, gap: 4 }, 400: { column: 2, gap: 2 } }"
    >
      <template #default="{ item }">
        <div class="card">
          <div
            class="media-wrapper"
            :style="{ paddingTop: (item.coverHeight / item.coverWidth) * 100 + '%' }"
          >
            <img
              v-if="item.type === 'image'"
              :src="item.cover"
              class="media"
              loading="lazy"
              @load="onLoad($event, item)"
              v-show="item.loaded"
              :alt="item.title"
            />
            <video
              v-else
              class="media"
              controls
              :src="item.video"
              :poster="item.cover"
              @loadedmetadata="onLoad($event, item)"
              v-show="item.loaded"
              :alt="item.title"
            ></video>
            <div v-if="!item.loaded" class="media-loading">加载中...</div>
          </div>
          <div class="title">{{ item.title }}</div>
        </div>
      </template>
    </Waterfall>
    <div v-if="loading" class="loading-indicator">加载中...</div>
    <div v-if="finished" class="finished-indicator">没有更多了</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const props = defineProps({
  api: { type: String, required: true }
})

const list = ref([])
const page = ref(1)
const pageSize = 20
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

async function fetchData(reset = false) {
  if (loading.value) return
  loading.value = true
  const res = await fetch(props.api)
  const data = await res.json()
  data.list.forEach(item => (item.loaded = false))
  if (reset) {
    list.value = data.list
    finished.value = false
  } else {
    list.value = [...list.value, ...data.list]
  }
  if (data.list.length < pageSize) finished.value = true
  loading.value = false
  refreshing.value = false
}

function onScroll() {
  if (loading.value || finished.value) return
  const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (scrollBottom) {
    page.value++
    fetchData()
  }
}

onMounted(() => {
  fetchData(true)
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

// 下拉刷新（移动端简单实现）
let startY = 0
function onTouchStart(e) {
  if (window.scrollY === 0) {
    startY = e.touches[0].clientY
  }
}
function onTouchMove(e) {
  if (window.scrollY === 0 && e.touches[0].clientY - startY > 60 && !refreshing.value) {
    refreshing.value = true
    page.value = 1
    fetchData(true)
  }
}
function onTouchEnd() {
  startY = 0
}

function onLoad(e, item) {
  item.loaded = true
}

onMounted(fetchData)
watch(() => props.api, fetchData)
</script>

<style scoped>
.waterfall-container {
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  position: relative;
}
.card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px #0001;
  display: flex;
  flex-direction: column;
}
.media-wrapper {
  position: relative;
  width: 100%;
  background: #f0f0f0;
}
.media {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}
.media-loading {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1rem;
  background: #f0f0f0;
}
.title {
  padding: 8px 12px;
  font-size: 1rem;
  color: #333;
  word-break: break-all;
}
.loading-indicator,
.finished-indicator,
.refresh-indicator {
  text-align: center;
  color: #888;
  padding: 12px 0;
  font-size: 1rem;
}
.refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background: #f0f0f0;
  z-index: 10;
}
</style>
