import { ref, computed } from 'vue'

/**
 * Composable for managing authentication state.
 *
 * The JWT token is persisted in sessionStorage so it survives page refreshes
 * within the same tab but is cleared when the tab is closed. The `http`
 * interceptor in `src/shared/api/http.ts` reads `authToken` from sessionStorage
 * and attaches it as the `Authorization: Bearer` header automatically.
 */
export function useAuth() {
  // Token Management
  const token = ref<string | null>(sessionStorage.getItem('authToken'))
  const isAuthenticated = computed(() => !!token.value)

  const refreshToken = () => {
    token.value = sessionStorage.getItem('authToken')
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
