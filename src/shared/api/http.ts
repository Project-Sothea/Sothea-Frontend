import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import snakecaseKeys from 'snakecase-keys'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
})

// Attach Authorization header from sessionStorage (kept in useAuth) for every request
http.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken')
  if (token) {
    config.headers = config.headers || {}
    // Do not overwrite if a specific request already set Authorization
    if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
  }

  // Convert outgoing JSON payloads to snake_case using library (skip FormData)
  const data = config.data
  const isFormData = typeof FormData !== 'undefined' && data instanceof FormData
  if (data && !isFormData && (typeof data === 'object' || Array.isArray(data))) {
    config.data = snakecaseKeys(data as any, { deep: true }) as any
  }

  return config
})

http.interceptors.response.use(
  (resp) => {
    // Convert snake_case keys from backend to camelCase for the app
    if (resp && resp.data && (typeof resp.data === 'object' || Array.isArray(resp.data))) {
      resp.data = camelcaseKeys(resp.data as any, { deep: true }) as any
    }
    return resp
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token & force navigation to sign-in
      sessionStorage.removeItem('authToken')
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in'
      }
    }
    return Promise.reject(error)
  }
)
