import { http } from '@shared/api/http'

/** Send a login request and return the server response (includes auth token). */
export async function loginRequest(username: string) {
  const { data } = await http.post<LoginResponse>('/login', { username })
  return data
}

/** Fetch the list of all registered users. */
export async function listUsers() {
  const { data } = await http.get<User[]>('/users')
  return data
}
