import { http } from '@shared/api/http'

interface LoginResponse {
  token: string
}

export async function loginRequest(username: string, password: string) {
  const { data } = await http.post<LoginResponse>('/login', { username, password })
  return data
}
