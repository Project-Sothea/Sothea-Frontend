import { AxiosError } from 'axios'

export function handleApiError(error: unknown): string {
  if (isAxiosError(error)) {
    const err = error as AxiosError<any>
    if (err.response) return err.message || 'Request failed'
    if (err.request) return 'No server response received'
    return 'Request setup failed'
  }
  return 'Unexpected error'
}

function isAxiosError(e: any): e is AxiosError {
  return !!e && typeof e === 'object' && 'isAxiosError' in e
}
