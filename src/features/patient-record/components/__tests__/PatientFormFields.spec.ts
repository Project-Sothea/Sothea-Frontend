// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, type App } from 'vue'
import { format } from 'date-fns'
import PatientFormFields from '../PatientFormFields.vue'
import { usePatientForm } from '@patient-record/composables/usePatientForm'

let app: App

afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
})

async function flush() {
  for (let i = 0; i < 5; i++) await nextTick()
}

async function mountForm(disabled = false) {
  const form = usePatientForm({ initial: { dob: new Date(2000, 5, 15) } })
  const root = document.createElement('div')
  document.body.append(root)
  app = createApp({
    render: () => h(PatientFormFields, { form, disabled, maxDate: '2026-11-03' })
  })
  app.mount(root)
  await flush()
  const input = document.querySelector<HTMLInputElement>('#patient-dob')!
  return { form, input }
}

async function typeDate(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await flush()
}

describe('patient date of birth', () => {
  it('uses a text datepicker with a four-digit year', async () => {
    const { input } = await mountForm()
    expect(input.type).toBe('text')
    expect(input.value).toBe('15/06/2000')
    expect(input.placeholder).toBe('DD/MM/YYYY')
  })

  it('opens the calendar from DOB and applies a selected day', async () => {
    const { form, input } = await mountForm()
    input.click()
    await flush()
    expect(input.getAttribute('aria-expanded')).toBe('true')
    await vi.waitFor(() => {
      expect(document.querySelector('[data-test-id="calendar-header"]')).not.toBeNull()
    })
    const day = document.querySelector<HTMLElement>('[aria-label="June 20th, 2000"]')!
    day.click()
    await flush()
    expect(format(form.dob.value, 'yyyy-MM-dd')).toBe('2000-06-20')
    expect(input.value).toBe('20/06/2000')
  })

  it('preserves 1990 while typing and does not commit incomplete years', async () => {
    const { form, input } = await mountForm()
    input.focus()
    for (const value of ['15/06/1', '15/06/19', '15/06/199']) {
      await typeDate(input, value)
      expect(input.value).toBe(value)
      expect(form.dob.value.getFullYear()).toBe(2000)
    }
    await typeDate(input, '15/06/1990')
    expect(input.value).toBe('15/06/1990')
    expect(format(form.dob.value, 'yyyy-MM-dd')).toBe('1990-06-15')
    input.blur()
    await flush()
    expect(input.value).toBe('15/06/1990')
  })

  it('rejects impossible dates and future dates', async () => {
    const { form, input } = await mountForm()
    for (const value of ['31/02/1990', '29/02/1991', '04/11/2026']) {
      await typeDate(input, value)
      expect(format(form.dob.value, 'yyyy-MM-dd')).toBe('2000-06-15')
    }
    await typeDate(input, '29/02/1992')
    expect(format(form.dob.value, 'yyyy-MM-dd')).toBe('1992-02-29')
  })

  it('updates from form resets and respects read-only patient details', async () => {
    const { form, input } = await mountForm(true)
    expect(input.disabled).toBe(true)
    form.reset({ dob: new Date(1985, 0, 2) })
    await flush()
    expect(input.value).toBe('02/01/1985')
  })
})
