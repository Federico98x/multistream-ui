<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Multistream Control Center
      </h1>
      <p class="text-gray-300 text-lg">Stream to multiple platforms simultaneously</p>
    </div>

    <!-- Main Layout: Stream Control + Chat -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      <!-- Stream Control (2/3 width) -->
      <div class="xl:col-span-2">
        <StreamControl />
      </div>
      
      <!-- Live Chat (1/3 width) -->
      <div class="xl:col-span-1">
        <ChatContainer />
      </div>
    </div>

    <!-- Dashboard Stats -->
    <div class="mb-8">
      <Dashboard />
    </div>
  </div>
</template>

<script setup lang="ts">
import StreamControl from '@/components/stream/StreamControl.vue'
import ChatContainer from '@/components/chat/ChatContainer.vue'
import Dashboard from '@/components/dashboard/Dashboard.vue'
</script>