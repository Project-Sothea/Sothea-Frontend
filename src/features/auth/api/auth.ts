import { http } from '@shared/api/http'
import type { LoginResponse, User } from '../types/Profiles'

export async function loginRequest(username: string) {
  const { data } = await http.post<LoginResponse>('/login', { username })
  return data
}

export async function listUsers() {
  const { data } = await http.get<User[]>('/users')
  return data
}
