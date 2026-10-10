// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, shallowRef, type App } from 'vue'
import PrescriptionModal from '../PrescriptionModal.vue'
import DrConsultModal from '../DrConsultModal.vue'
import * as prescriptions from '@/features/pharmacy/api/prescription'
import { updateSection } from '@features/patient-record/api/visit'

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })
}))
vi.mock('@/features/pharmacy/api/prescription', () => ({
  getPrescriptionByVisit: vi.fn(),
  getPrescriptionByID: vi.fn(),
  createPrescription: vi.fn(),
  updatePrescription: vi.fn(),
  dispensePrescription: vi.fn()
}))
vi.mock('@/features/pharmacy/api/drug', () => ({ listDrugs: vi.fn().mockResolvedValue([]) }))
vi.mock('../PrescriptionLineRow.vue', () => ({ default: { render: () => null } }))
vi.mock('@features/patient-record/api/visit', () => ({
  updateSection: vi.fn().mockResolvedValue(undefined)
}))

let app: App
async function flush() {
  for (let i = 0; i < 10; i++) await nextTick()
}
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})
afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
})

describe('clinical shared state', () => {
  it('keeps unsaved notes when lines or allocations refresh', async () => {
    vi.mocked(prescriptions.getPrescriptionByVisit).mockResolvedValue({ id: 7 } as any)
    vi.mocked(prescriptions.getPrescriptionByID).mockResolvedValue({
      id: 7,
      notes: 'saved',
      lines: []
    } as any)
    const root = document.createElement('div')
    document.body.append(root)
    app = createApp(PrescriptionModal, { patientId: '1', patientVid: '2' })
    const state = (app.mount(root) as any).$.setupState
    await flush()
    state.headerNotesEditing = true
    state.headerNotes = 'unsaved notes'
    await flush()
    await state.refreshRx()
    expect(state.headerNotes).toBe('unsaved notes')
    expect(localStorage.getItem('patient-record:draft:1:2:prescription')).toContain('unsaved notes')
    state.headerNotesEditing = false
    await state.refreshRx()
    expect(state.headerNotes).toBe('saved')
  })

  it('publishes a successful consultation save and discards back to the latest saved values', async () => {
    const record = shallowRef<any>({
      doctorsConsultation: { well: true, referralNeeded: false, diagnosis: 'old', treatment: 'old' }
    })
    let child: any
    app = createApp({
      render: () =>
        h(DrConsultModal, {
          ref: (vm: any) => {
            child = vm
          },
          patientId: '1',
          patientVid: '2',
          patientData: record.value,
          onDoctorsConsultationUpdated: (consultation: any) => {
            record.value = { ...record.value, doctorsConsultation: consultation }
          }
        })
    })
    const root = document.createElement('div')
    document.body.append(root)
    app.mount(root)
    await flush()
    const state = child.$.setupState
    state.toggleEdit()
    state.diagnosis = 'new diagnosis'
    state.treatment = 'new treatment'
    await state.submitData()
    await flush()
    expect(updateSection).toHaveBeenCalledWith(
      '1',
      '2',
      'doctorsConsultation',
      expect.objectContaining({ diagnosis: 'new diagnosis' })
    )
    expect(record.value.doctorsConsultation.treatment).toBe('new treatment')
    state.toggleEdit()
    state.diagnosis = 'discard this'
    state.discardEdit()
    expect(state.diagnosis).toBe('new diagnosis')
  })
})
