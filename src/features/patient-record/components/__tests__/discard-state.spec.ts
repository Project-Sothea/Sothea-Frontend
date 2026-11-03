// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, nextTick, type App } from 'vue'
import PhysiotherapyModal from '../PhysiotherapyModal.vue'

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })
}))
vi.mock('@features/patient-record/api/visit', () => ({ updateSection: vi.fn() }))

let app: App
const key = 'patient-record:draft:1:2:physiotherapy'

beforeEach(() => localStorage.clear())
afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
})

function mountRecord(physiotherapy: any) {
  const root = document.createElement('div')
  document.body.append(root)
  app = createApp(PhysiotherapyModal, {
    patientId: '1', patientVid: '2', patientData: { physiotherapy } as any
  })
  return (app.mount(root) as any).$.setupState
}

describe('discarding clinical edits', () => {
  it('restores saved values and clears edits to omitted optional fields', async () => {
    const state = mountRecord({ subjectiveAssessment: 'Saved assessment', painScale: null })
    state.toggleEdit()
    state.subjectiveAssessment = 'Unsaved assessment'
    state.painScale = 5
    state.objectiveAssessment = 'Unsaved objective'
    state.intervention = 'Unsaved intervention'
    await nextTick()
    expect(localStorage.getItem(key)).toContain('Unsaved intervention')

    state.discardEdit()
    await nextTick()

    expect(state.subjectiveAssessment).toBe('Saved assessment')
    expect(state.painScale).toBeNull()
    expect(state.objectiveAssessment).toBe('')
    expect(state.intervention).toBe('')
    expect(state.isEditing).toBe(false)
    expect(localStorage.getItem(key)).toBeNull()
  })

  it.each([null, undefined])('clears a restored draft when the server section is %s', async (section) => {
    localStorage.setItem(key, JSON.stringify({
      savedAt: Date.now(),
      data: { subjectiveAssessment: 'Restored draft', painScale: 7, evaluation: 'Draft evaluation' }
    }))
    const state = mountRecord(section)
    expect(state.subjectiveAssessment).toBe('Restored draft')
    expect(state.isEditing).toBe(true)

    state.discardEdit()
    await nextTick()

    expect(state.subjectiveAssessment).toBe('')
    expect(state.painScale).toBeNull()
    expect(state.evaluation).toBe('')
    expect(state.isEditing).toBe(false)
    expect(localStorage.getItem(key)).toBeNull()
  })
})
