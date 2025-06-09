<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Real-time Chart -->
    <div class="glass-dark rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-white mb-4">Live Performance</h3>
      <div class="h-64">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- System Status -->
    <div class="glass-dark rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-white mb-4">System Health</h3>
      <div class="space-y-4">
        <HealthMetric
          label="API Memory"
          :value="systemStats.api?.memory || 0"
          :max="100"
          unit="MB"
          color="blue"
        />
        <HealthMetric
          label="Stream Memory"
          :value="systemStats.stream?.memory || 0"
          :max="200"
          unit="MB"
          color="green"
        />
        <HealthMetric
          label="CPU Usage"
          :value="cpuUsage"
          :max="100"
          unit="%"
          color="purple"
        />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="lg:col-span-2 glass-dark rounded-2xl p-6">
      <h3 class="text-xl font-semibold text-white mb-4">Quick Actions</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction
          label="Configure Twitch"
          icon="cog"
          color="twitch"
          @click="openPlatformConfig('twitch')"
        />
        <QuickAction
          label="Configure YouTube"
          icon="cog"
          color="youtube"
          @click="openPlatformConfig('youtube')"
        />
        <QuickAction
          label="View Logs"
          icon="document-text"
          color="blue"
          @click="openLogs"
        />
        <QuickAction
          label="Settings"
          icon="adjustments"
          color="gray"
          @click="openSettings"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useStreamStore } from '@/stores/stream'
import HealthMetric from '../ui/HealthMetric.vue'
import QuickAction from '../ui/QuickAction.vue'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const streamStore = useStreamStore()
const dataPoints = ref<any[]>([])
const maxDataPoints = 30

const streamStats = computed(() => streamStore.stats)
const systemStats = computed(() => streamStore.systemStats)
const cpuUsage = computed(() => Math.round(Math.random() * 30 + 10)) // Mock for now

const chartData = computed(() => ({
  labels: dataPoints.value.map((_, i) => `${i}s`),
  datasets: [
    {
      label: 'Bitrate (kbps)',
      data: dataPoints.value.map(d => d.bitrate),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'FPS',
      data: dataPoints.value.map(d => d.fps),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      yAxisID: 'y1'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#fff'
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff'
      }
    },
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#fff'
      }
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false
      },
      ticks: {
        color: '#fff'
      }
    }
  }
}

let interval: number

const openPlatformConfig = (platform: string) => {
  // TODO: Open platform configuration modal
  console.log(`Configure ${platform}`)
}

const openLogs = () => {
  // TODO: Open logs modal
  console.log('Open logs')
}

const openSettings = () => {
  // TODO: Open settings modal
  console.log('Open settings')
}

onMounted(() => {
  interval = setInterval(() => {
    if (streamStore.isStreaming && streamStats.value.stats) {
      dataPoints.value.push({
        bitrate: streamStats.value.stats.bitrate || 0,
        fps: streamStats.value.stats.fps || 0
      })
      
      if (dataPoints.value.length > maxDataPoints) {
        dataPoints.value.shift()
      }
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>