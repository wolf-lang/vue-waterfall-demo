<template>
  <div class="discover-page">
    <WaterfallList :api="api" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import WaterfallList from '../components/WaterfallList.vue'

const list = ref([])
const api = ref('/api/discover')

function getApi() {
  const params = new URLSearchParams(window.location.search)
  const type = params.get('type') || 'A'
  return `/api/discover?type=${type}`
}

async function fetchData() {
  api.value = getApi()
  const res = await fetch(api.value)
  const data = await res.json()
  list.value = data.list
}

onMounted(fetchData)

// 如果你想支持前端切换参数，可以监听 window.location.search 变化
window.addEventListener('popstate', fetchData)
</script>

<style>
.discover-page {
  width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
  background: #f5f5f5;
  box-sizing: border-box;
}
</style>
