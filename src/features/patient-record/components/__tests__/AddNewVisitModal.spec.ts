// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick, type App } from 'vue'
import AddNewVisitModal from '../AddNewVisitModal.vue'
import { createPatientVisit } from '@patient-record/api/visit'

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() })
}))
vi.mock('@patient-record/api/visit', () => ({
  createPatientVisit: vi.fn().mockResolvedValue({ vid: 2 })
}))

let app: App | undefined

afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.clearAllMocks()
})

function mountVisit() {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 4, 0, 58))
  const root = document.createElement('div')
  document.body.append(root)
  app = createApp(AddNewVisitModal, {
    patientId: '1',
    patientData: {
      admin: {
        regDate: new Date('2026-11-01T00:00:00Z'),
        queueNo: '123',
        pregnant: false,
        sentToId: false,
        lastMenstrualPeriod: null
      }
    } as any
  })
  app.mount(root)
  return root
}

describe('new visit registration date', () => {
  it.each([null, '2026-11-02'])('saves the displayed calendar day at 12:58 a.m. (selection: %s)', async (selectedDate) => {
    const root = mountVisit()
    const input = root.querySelector<HTMLInputElement>('input[type="date"]')!
    expect(input.value).toBe('2026-11-04')

    if (selectedDate) {
      input.value = selectedDate
      input.dispatchEvent(new Event('input', { bubbles: true }))
      await nextTick()
    }

    const displayedDate = input.value
    root.querySelector<HTMLButtonElement>('button')!.click()
    await nextTick()

    expect(createPatientVisit).toHaveBeenCalledOnce()
    const [patientId, admin] = vi.mocked(createPatientVisit).mock.calls[0]
    expect(patientId).toBe('1')
    const wireDate = JSON.parse(JSON.stringify(admin)).regDate
    expect(wireDate).toBe(`${displayedDate}T00:00:00.000Z`)
    const clinicDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Phnom_Penh', year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date(wireDate))
    expect(clinicDate).toBe(displayedDate)
  })
})
