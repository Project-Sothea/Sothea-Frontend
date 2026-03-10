import { http } from '@shared/api/http'

interface LoginResponse {
  token: string
}

export async function loginRequest(username: string): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/login', { username })
  return data
}
