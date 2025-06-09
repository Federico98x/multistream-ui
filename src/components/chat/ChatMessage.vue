<template>
  <div class="chat-message group">
    <div class="flex items-start gap-3">
      <!-- Platform Badge -->
      <div 
        class="platform-badge mt-1"
        :class="platformClass"
      >
        <TwitchIcon v-if="message.platform === 'twitch'" class="w-3 h-3" />
        <YouTubeIcon v-else class="w-3 h-3" />
      </div>

      <!-- Message Content -->
      <div class="flex-1 min-w-0">
        <!-- Username and badges -->
        <div class="flex items-center gap-2 mb-1">
          <span 
            class="font-semibold text-sm truncate"
            :style="{ color: message.color || '#ffffff' }"
          >
            {{ message.username }}
          </span>
          
          <!-- User badges -->
          <div v-if="message.badges?.length" class="flex gap-1">
            <span
              v-for="badge in message.badges"
              :key="badge"
              class="px-1 py-0.5 text-xs bg-gray-700 text-gray-300 rounded"
            >
              {{ badge }}
            </span>
          </div>
          
          <!-- Timestamp -->
          <span class="text-xs text-gray-500 ml-auto">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>

        <!-- Message text with emotes -->
        <div class="text-sm text-gray-200 break-words">
          <span v-html="processedMessage"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TwitchIcon from '../ui/icons/TwitchIcon.vue'
import YouTubeIcon from '../ui/icons/YouTubeIcon.vue'
import type { ChatMessage } from '@/types'

const props = defineProps<{
  message: ChatMessage
}>()

const platformClass = computed(() => ({
  'bg-twitch-500/20 text-twitch-400 border border-twitch-500/30': props.message.platform === 'twitch',
  'bg-youtube-500/20 text-youtube-400 border border-youtube-500/30': props.message.platform === 'youtube'
}))

const processedMessage = computed(() => {
  let text = props.message.message
  
  // Process emotes if available
  if (props.message.emotes?.length) {
    // Sort emotes by position (reverse order to avoid index shifting)
    const sortedEmotes = [...props.message.emotes].sort((a, b) => b.positions[0][0] - a.positions[0][0])
    
    for (const emote of sortedEmotes) {
      for (const [start, end] of emote.positions) {
        const emoteImg = `<img src="${emote.url}" alt="${emote.name}" class="inline w-6 h-6 align-middle mx-1" title="${emote.name}" />`
        text = text.slice(0, start) + emoteImg + text.slice(end + 1)
      }
    }
  }
  
  return text
})

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>