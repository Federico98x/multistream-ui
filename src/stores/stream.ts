import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import type { Platform, StreamStats, SystemStats } from '@/types'
import { useNotificationStore } from './notification'

export const useStreamStore = defineStore('stream', () => {
  // State
  const stats = ref<StreamStats>({ active: false, platforms: [] })
  const platforms = ref<Platform[]>([])
  const systemStats = ref<SystemStats>({})
  const socket = ref<Socket | null>(null)

  // Computed
  const isStreaming = computed(() => stats.value.active)

  // Actions
  async function connectWebSocket() {
    const notificationStore = useNotificationStore()
    
    try {
      socket.value = io('/', {
        path: '/socket.io/',
        transports: ['websocket', 'polling']
      })

      socket.value.on('stats', (data) => {
        stats.value = data
      })

      socket.value.on('connect', () => {
        console.log('WebSocket connected')
        notificationStore.addNotification({
          type: 'success',
          title: 'Connected',
          message: 'Real-time connection established'
        })
      })

      socket.value.on('disconnect', () => {
        notificationStore.addNotification({
          type: 'warning',
          title: 'Disconnected',
          message: 'Lost connection to server'
        })
      })

      socket.value.on('error', (error) => {
        console.error('WebSocket error:', error)
        notificationStore.addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to connect to server'
        })
      })
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  async function fetchInitialData() {
    const notificationStore = useNotificationStore()
    
    try {
      const [platformsRes, statusRes] = await Promise.all([
        axios.get('/api/platforms'),
        axios.get('/api/stream/status')
      ])
      
      platforms.value = platformsRes.data.map((platform: any) => ({
        id: platform.id,
        name: platform.name,
        configured: platform.configured || false,
        isActive: false,
        color: platform.id === 'twitch' ? '#9146ff' : '#ff0000'
      }))
      
      stats.value = statusRes.data
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
      
      // Fallback mock data for development
      platforms.value = [
        {
          id: 'twitch',
          name: 'Twitch',
          configured: true,
          isActive: false,
          color: '#9146ff'
        },
        {
          id: 'youtube',
          name: 'YouTube',
          configured: true,
          isActive: false,
          color: '#ff0000'
        }
      ]
      
      notificationStore.addNotification({
        type: 'warning',
        title: 'Using Mock Data',
        message: 'Could not connect to backend, using sample data'
      })
    }
  }

  async function startStream(selectedPlatforms: string[]) {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await axios.post('/api/stream/start', {
        platforms: selectedPlatforms
      })
      
      notificationStore.addNotification({
        type: 'success',
        title: 'Stream Started',
        message: `Broadcasting to ${selectedPlatforms.join(', ')}`
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to start stream:', error)
      
      notificationStore.addNotification({
        type: 'error',
        title: 'Stream Failed',
        message: 'Could not start streaming'
      })
      
      // Mock success for development
      stats.value = {
        active: true,
        uptime: 0,
        stats: { bitrate: 2500, fps: 30, viewers: 0 },
        platforms: selectedPlatforms
      }
      
      throw error
    }
  }

  async function stopStream() {
    const notificationStore = useNotificationStore()
    
    try {
      const response = await axios.post('/api/stream/stop')
      
      notificationStore.addNotification({
        type: 'info',
        title: 'Stream Stopped',
        message: 'Broadcasting has ended'
      })
      
      return response.data
    } catch (error) {
      console.error('Failed to stop stream:', error)
      
      // Mock stop for development
      stats.value = {
        active: false,
        platforms: []
      }
      
      notificationStore.addNotification({
        type: 'info',
        title: 'Stream Stopped',
        message: 'Broadcasting has ended'
      })
    }
  }

  async function fetchSystemStats() {
    try {
      const response = await axios.get('/api/system/stats')
      systemStats.value = response.data
    } catch (error) {
      console.error('Failed to fetch system stats:', error)
      
      // Mock system stats
      systemStats.value = {
        api: { memory: 45, cpu: 15 },
        stream: { memory: 120, cpu: 25 }
      }
    }
  }

  return {
    stats,
    platforms,
    systemStats,
    isStreaming,
    connectWebSocket,
    fetchInitialData,
    startStream,
    stopStream,
    fetchSystemStats
  }
})