<template>
  <div class="min-h-screen gradient-bg">
    <!-- Animated background -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10">
      <RouterView />
    </div>

    <!-- Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'
import { useStreamStore } from '@/stores/stream'
import { useChatStore } from '@/stores/chat'
import { onMounted } from 'vue'

const streamStore = useStreamStore()
const chatStore = useChatStore()

onMounted(() => {
  streamStore.connectWebSocket()
  streamStore.fetchInitialData()
  chatStore.initialize()
})
</script>