export function calculateAge(dobInput: Date | string | null | undefined): number | null {
  if (!dobInput) return null
  const dob = dobInput instanceof Date ? dobInput : new Date(dobInput)
  if (isNaN(dob.getTime())) return null

  const today = new Date()
  let years = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    years--
  }
  return years
}
