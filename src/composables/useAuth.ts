import { ref, computed } from 'vue'
import axios from 'axios'

export function useAuth() {
  // Token Management
  const token = ref<string | null>(sessionStorage.getItem('authToken'))
  const isAuthenticated = computed(() => !!token.value)

  const refreshToken = () => {
    const currentToken = sessionStorage.getItem('authToken')
    token.value = currentToken
  }

  // Authentication Actions
  const login = (newToken: string) => {
    sessionStorage.setItem('authToken', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    token.value = newToken
  }

  const logout = () => {
    sessionStorage.removeItem('authToken')
    delete axios.defaults.headers.common['Authorization']
    token.value = null
  }

  // Session Management
  const initializeAuth = () => {
    const storedToken = sessionStorage.getItem('authToken')
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      token.value = storedToken
    }
  }

  return {
    // Token state
    token: computed(() => token.value),
    isAuthenticated,
    refreshToken,

    // Authentication
    login,
    logout,

    // Session
    initializeAuth
  }
}
