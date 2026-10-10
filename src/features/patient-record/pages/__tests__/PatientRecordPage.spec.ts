// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref, type App } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { fetchPatientRecord } from '@patient-record/api/visit'

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() })
}))
vi.mock('@patient-record/api/visit', () => ({
  fetchPatientRecord: vi.fn(),
  deletePatientVisit: vi.fn()
}))
vi.mock('@patient-record/api/patient', () => ({ deletePatient: vi.fn() }))
vi.mock('@patient-record/api/record', () => ({
  fetchPatientMeta: vi.fn().mockResolvedValue({ visits: {} })
}))

const form = defineComponent({
  props: ['patientId', 'patientVid', 'patientData'],
  setup(props) {
    const draft = ref(props.patientData.patientDetails.name)
    return () =>
      h('input', {
        'data-form': `${props.patientId}:${props.patientVid}`,
        value: draft.value,
        onInput: (event: any) => {
          draft.value = event.target.value
        }
      })
  }
})
let Page: any
let app: App
async function flush() {
  for (let i = 0; i < 10; i++) await nextTick()
}
const record = (name: string) =>
  ({ patientDetails: { name, dob: '2000-01-01' }, admin: { queueNo: '1' } }) as any

beforeAll(async () => {
  for (const name of [
    'PatientModal',
    'AdminModal',
    'PastMedHistModal',
    'SocialHistModal',
    'VitalStatsModal',
    'HeightWeightModal',
    'VisualAcuityModal',
    'FallRiskModal',
    'DrConsultModal',
    'PhysiotherapyModal',
    'AddNewVisitModal',
    'DentalModal',
    'PrescriptionModal'
  ]) {
    vi.doMock(`@patient-record/components/${name}.vue`, () => ({ default: form }))
  }
  for (const name of ['SideBar', 'SubNavBar', 'RecordsModal']) {
    vi.doMock(`@patient-record/components/${name}.vue`, () => ({ default: { render: () => null } }))
  }
  vi.doMock('@shared/ui/navigation/NavBar.vue', () => ({ default: { render: () => null } }))
  Page = (await import('../PatientRecordPage.vue')).default
})
beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})
afterEach(() => {
  app?.unmount()
  document.body.innerHTML = ''
})

async function mountPage() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/patient/:id/:vid', component: Page }]
  })
  await router.push('/patient/1/1')
  app = createApp(Page).use(router)
  const root = document.createElement('div')
  document.body.append(root)
  const vm = app.mount(root) as any
  await flush()
  return { router, state: vm.$.setupState }
}

describe('patient and visit form scope', () => {
  it('remounts cached forms when the visit or patient changes', async () => {
    vi.mocked(fetchPatientRecord).mockImplementation(async (id, vid) => record(`${id}:${vid}`))
    const { router, state } = await mountPage()
    const input = document.querySelector('input')!
    input.value = 'unsaved old visit'
    input.dispatchEvent(new Event('input'))
    state.activeSection = 'prescriptions'
    await flush()
    await router.push('/patient/1/2')
    await flush()
    expect(document.querySelector('input')?.value).toBe('1:2')
    expect(document.querySelector('input')?.dataset.form).toBe('1:2')
    state.activeSection = 'patient'
    await flush()
    expect(document.querySelector('input')?.value).toBe('1:2')
    await router.push('/patient/2/2')
    await flush()
    expect(document.querySelector('input')?.value).toBe('2:2')
  })

  it('ignores a previous visit response that arrives after navigation', async () => {
    let finishOld!: (value: any) => void
    vi.mocked(fetchPatientRecord).mockImplementation((_, vid) =>
      vid === '1'
        ? new Promise((resolve) => {
            finishOld = resolve
          })
        : Promise.resolve(record('new visit'))
    )
    const { router } = await mountPage()
    expect(document.querySelector('input')).toBeNull()
    await router.push('/patient/1/2')
    await flush()
    finishOld(record('old visit'))
    await flush()
    expect(document.querySelector('input')?.value).toBe('new visit')
  })
})
