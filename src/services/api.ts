import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth tokens if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      localStorage.removeItem('auth_token')
    }
    
    return Promise.reject(error)
  }
)

// Stream API
export const streamAPI = {
  getStatus: () => api.get('/stream/status'),
  start: (platforms: string[]) => api.post('/stream/start', { platforms }),
  stop: () => api.post('/stream/stop'),
  getStats: () => api.get('/stream/stats')
}

// Platform API
export const platformAPI = {
  getAll: () => api.get('/platforms'),
  configure: (platformId: string, config: any) => 
    api.post(`/platforms/${platformId}/configure`, config),
  getConfig: (platformId: string) => api.get(`/platforms/${platformId}/config`)
}

// System API
export const systemAPI = {
  getStats: () => api.get('/system/stats'),
  getLogs: () => api.get('/system/logs'),
  getHealth: () => api.get('/system/health')
}

// Chat API (for YouTube)
export const chatAPI = {
  getYouTubeAuth: () => api.get('/chat/youtube/auth'),
  getYouTubeChatId: (videoId: string) => api.get(`/chat/youtube/${videoId}/chatid`),
  getYouTubeMessages: (liveChatId: string) => api.get(`/chat/youtube/${liveChatId}/messages`)
}

export default api