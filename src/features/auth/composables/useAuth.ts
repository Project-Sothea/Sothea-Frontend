import { ref, computed } from 'vue'

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
    // Persist token; http interceptor will attach header automatically
    sessionStorage.setItem('authToken', newToken)
    token.value = newToken
  }

  const logout = () => {
    sessionStorage.removeItem('authToken')
    token.value = null
  }

  // Session Management
  const initializeAuth = () => {
    // Sync local ref with any pre-existing session token (interceptor handles header)
    const storedToken = sessionStorage.getItem('authToken')
    if (storedToken) token.value = storedToken
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
