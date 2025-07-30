import axios from 'axios'

export const authUtils = {
  getToken(): string | null {
    return sessionStorage.getItem('authToken')
  },

  setToken(token: string): void {
    sessionStorage.setItem('authToken', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  removeToken(): void {
    sessionStorage.removeItem('authToken')
    delete axios.defaults.headers.common['Authorization']
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  restoreSession(): void {
    const token = this.getToken()
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }
}
