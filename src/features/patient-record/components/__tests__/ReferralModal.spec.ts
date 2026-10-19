// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, ref, type App } from 'vue'
import ReferralModal from '../ReferralModal.vue'
import { updateSection } from '@patient-record/api/visit'

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })
}))
vi.mock('@patient-record/api/visit', () => ({ updateSection: vi.fn() }))
let app: App
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  vi.mocked(updateSection).mockResolvedValue(undefined)
})
afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
})
async function flush() {
  for (let i = 0; i < 10; i++) await nextTick()
}
function mountRecord(data: any, age = 30) {
  const navigate = vi.fn()
  const record = ref(data)
  let child: any
  const root = document.createElement('div')
  document.body.append(root)
  app = createApp({
    render: () =>
      h(ReferralModal, {
        ref: (vm: any) => {
          child = vm
        },
        patientId: '1',
        patientVid: '2',
        patientData: record.value,
        age,
        'onUpdate:activeSection': navigate,
        onReferralUpdated: (value: any) => {
          record.value.referral = value
        }
      })
  })
  app.mount(root)
  return { record, navigate, state: child.$.setupState }
}
describe('referral', () => {
  it('shows the existing alerts and updates when measurements change', async () => {
    const { record, navigate } = mountRecord(
      {
        vitalStatistics: { temperature: 38 },
        visualAcuity: { lEyeVision: 30, rEyeVision: 6 },
        fallRisk: { sideToSideBalance: 0 }
      },
      16
    )
    expect(document.querySelectorAll('li')).toHaveLength(4)
    expect(document.body.textContent).toContain('Referral to Khmer Optics needed')
    const warnings = document.querySelectorAll<HTMLButtonElement>('li button')
    for (const [index, section] of [
      'patient',
      'vital-stats',
      'visual-acuity',
      'fall-risk'
    ].entries()) {
      warnings[index].click()
      expect(navigate).toHaveBeenLastCalledWith(section)
    }
    expect(updateSection).not.toHaveBeenCalled()
    record.value = {}
    await flush()
    expect(document.querySelectorAll('li')).toHaveLength(1)
  })
  it('saves referral fields while preserving consultation data and supports discard', async () => {
    const { record, state } = mountRecord({
      doctorsConsultation: {
        well: true,
        diagnosis: 'Existing diagnosis',
        treatment: 'Existing treatment',
        referralNeeded: false,
        referralLoc: '',
        remarks: ''
      }
    })
    state.toggleEdit()
    state.whereToRefer = ' Khmer Optics '
    state.additionalComments = ' Follow up '
    await state.submitData()
    await flush()
    expect(updateSection).toHaveBeenCalledWith('1', '2', 'referral', {
      whereToRefer: 'Khmer Optics',
      additionalComments: 'Follow up'
    })
    expect(record.value.referral.whereToRefer).toBe('Khmer Optics')
    expect(record.value.doctorsConsultation.diagnosis).toBe('Existing diagnosis')
    expect(record.value.doctorsConsultation.referralNeeded).toBe(false)
    state.toggleEdit()
    state.whereToRefer = 'Discard this'
    state.discardEdit()
    expect(state.whereToRefer).toBe('Khmer Optics')
  })
  it('loads saved referral fields independently from consultation and can clear them', async () => {
    const { state } = mountRecord({
      referral: { whereToRefer: 'Clinic', additionalComments: 'Referral comments' },
      doctorsConsultation: { referralLoc: 'Other location', remarks: 'Consultation comments' }
    })
    expect(state.whereToRefer).toBe('Clinic')
    expect(state.additionalComments).toBe('Referral comments')
    state.toggleEdit()
    state.whereToRefer = ''
    state.additionalComments = ''
    await state.submitData()
    expect(updateSection).toHaveBeenCalledWith('1', '2', 'referral', {
      whereToRefer: '',
      additionalComments: ''
    })
  })
  it('restores drafts from the original referral tab', () => {
    localStorage.setItem(
      'patient-record:draft:1:2:referral',
      JSON.stringify({
        savedAt: Date.now(),
        data: { referralLoc: 'Unsaved clinic', remarks: 'Unsaved comments' }
      })
    )
    const { state } = mountRecord({})
    expect(state.isEditing).toBe(true)
    expect(state.whereToRefer).toBe('Unsaved clinic')
    expect(state.additionalComments).toBe('Unsaved comments')
  })
  it('keeps the draft editable when saving fails', async () => {
    vi.mocked(updateSection).mockRejectedValueOnce(new Error('Failed'))
    const { state, record } = mountRecord({})
    state.toggleEdit()
    state.whereToRefer = 'Clinic'
    await flush()
    await state.submitData()
    expect(state.isEditing).toBe(true)
    expect(state.whereToRefer).toBe('Clinic')
    expect(record.value.referral).toBeUndefined()
  })
})
