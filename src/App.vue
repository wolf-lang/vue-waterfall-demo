<template>
  <Discover />
</template>

<script setup>
import Discover from './pages/Discover.vue'
import { onMounted } from 'vue'

onMounted(() => {
  fetch('/api/ping')
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
})
</script>
