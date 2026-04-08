import { AxiosError } from 'axios'

/**
 * Converts an unknown thrown value into a human-readable error message.
 * Handles Axios errors by inspecting response, request, and setup failure states.
 */
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
