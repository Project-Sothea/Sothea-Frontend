// Central date formatting utilities

/**
 * Format a date (string or Date) as DD-MM-YYYY. Returns empty string on invalid input.
 */
export function formatDateDMY(input: string | Date | undefined | null): string {
  if (!input) return ''
  const d = input instanceof Date ? input : new Date(input)
  if (isNaN(d.getTime())) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}

/**
 * Accepts a raw date string and search fragment; supports DD/MM/YYYY or DD-MM-YYYY fuzzy match.
 */
export function matchDateDMY(regDate: string, searchValue: string): boolean {
  if (!regDate) return false
  const d = new Date(regDate)
  if (isNaN(d.getTime())) return false
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const slash = `${dd}/${mm}/${yyyy}`
  const dash = `${dd}-${mm}-${yyyy}`
  return slash.includes(searchValue) || dash.includes(searchValue)
}

/**
 * Format a Date or date-like value to YYYY-MM-DD (HTML date input friendly).
 */
export function formatDateISO(input: Date | string): string {
  const d = input instanceof Date ? input : new Date(input)
  if (isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
