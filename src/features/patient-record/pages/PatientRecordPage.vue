<template>
  <div>
    <NavBar />
    <div class="flex">
      <SideBar
        :activeSection="activeSection"
        :id="isCreateMode ? undefined : id || undefined"
        :name="isCreateMode ? undefined : name"
        :age="isCreateMode ? undefined : age || undefined"
        :isAdd="isCreateMode"
        :canDeleteVisit="visitCount > 1"
        @update:activeSection="setActiveSection"
        @openTryDeleteVisitModal="tryDeleteVisit = true"
        @openTryDeletePatientModal="tryDeletePatient = true"
      />
      <div class="flex-grow">
        <SubNavBar
          v-if="!isCreateMode"
          :id="id || ''"
          :regDate="regDate"
          :queueNo="queueNo"
          @openModal="openRecords"
          @refresh="tryReload = true"
        />
        <keep-alive>
          <component
            :is="activeComponent"
            :isAdd="isCreateMode"
            :patientId="String(id || createdPatientId || '')"
            :patientVid="String(vid || createdVisitVid || '')"
            :patientData="patient"
            :age="age"
            :canDeleteVisit="visitCount > 1"
            :pendingPatientPayload="pendingPatientPayload || undefined"
            @capturePatientPayload="capturePatientPayload"
            @patientCreated="handlePatientCreated"
            @patientUpdated="handlePatientUpdated"
            @patientVisitCreated="handlePatientVisitCreated"
            @adminUpdated="handleAdminUpdated"
            @reload="loadPatientData"
          />
        </keep-alive>
      </div>
    </div>

    <RecordsModal
      v-if="!isCreateMode"
      :id="id || ''"
      :vid="vid || ''"
      :isOpen="showRecords"
      :patientMeta="patientMeta || undefined"
      @close="closeRecords"
    />

    <!-- Delete Visit Confirmation -->
    <div
      v-if="!isCreateMode && tryDeleteVisit"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
    >
      <div
        class="bg-white rounded-lg p-10 max-w-full overflow-y-auto"
        style="max-height: 95%; max-width: 60%"
      >
        <div class="text-center text-lg text-gray-800 mb-6 mt-10">
          Are you sure you want to delete this patient visit?
        </div>
        <div class="flex justify-center space-x-10 my-10">
          <button
            @click="handleDeleteVisit"
            class="bg-[#3f51b5] hover:bg-[#5c6cc4] text-white font-bold py-2 px-6 rounded-md"
          >
            Yes
          </button>
          <button
            @click="tryDeleteVisit = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>

    <!-- Reload Confirmation -->
    <div
      v-if="!isCreateMode && tryReload"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
    >
      <div
        class="bg-white rounded-lg p-10 max-w-full overflow-y-auto"
        style="max-height: 95%; max-width: 60%"
      >
        <div class="text-center text-lg text-gray-800 mb-6 mt-10">
          Are you sure you want to reload? Any unsaved changes will be overwritten.
        </div>
        <div class="flex justify-center space-x-10 my-10">
          <button
            @click="handleReloadConfirm"
            class="bg-[#3f51b5] hover:bg-[#5c6cc4] text-white font-bold py-2 px-6 rounded-md"
          >
            Yes
          </button>
          <button
            @click="tryReload = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Patient Confirmation -->
    <div
      v-if="!isCreateMode && tryDeletePatient"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
    >
      <div
        class="bg-white rounded-lg p-10 max-w-full overflow-y-auto"
        style="max-height: 95%; max-width: 60%"
      >
        <div class="text-center text-lg text-gray-800 mb-6 mt-10">
          Are you sure you want to delete this patient and all visits?
        </div>
        <div class="flex justify-center space-x-10 my-10">
          <button
            @click="handleDeletePatient"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Yes
          </button>
          <button
            @click="tryDeletePatient = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-md"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import SideBar from '@patient-record/components/SideBar.vue'
import SubNavBar from '@patient-record/components/SubNavBar.vue'
import RecordsModal from '@patient-record/components/RecordsModal.vue'
import PatientModal from '@patient-record/components/PatientModal.vue'
import AdminModal from '@patient-record/components/AdminModal.vue'
import PastMedHistModal from '@patient-record/components/PastMedHistModal.vue'
import SocialHistModal from '@patient-record/components/SocialHistModal.vue'
import VitalStatsModal from '@patient-record/components/VitalStatsModal.vue'
import HeightWeightModal from '@patient-record/components/HeightWeightModal.vue'
import VisualAcuityModal from '@patient-record/components/VisualAcuityModal.vue'
import FallRiskModal from '@patient-record/components/FallRiskModal.vue'
import DrConsultModal from '@patient-record/components/DrConsultModal.vue'
import PhysiotherapyModal from '@patient-record/components/PhysiotherapyModal.vue'
import AddNewVisitModal from '@patient-record/components/AddNewVisitModal.vue'
import DentalModal from '@patient-record/components/DentalModal.vue'
import PrescriptionModal from '@patient-record/components/PrescriptionModal.vue'
import { deletePatient } from '@patient-record/api/patient'
import { fetchPatientRecord, deletePatientVisit } from '@patient-record/api/visit'
import { fetchPatientMeta } from '@patient-record/api/record'
import type Patient from '@patient-record/types/Patient'
import type PatientDetails from '@patient-record/types/PatientDetails'
import type PatientMeta from '@patient-record/types/PatientMeta'
import { useToast } from 'vue-toast-notification'
import { calculateAge } from '@shared/utils/age'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isCreateMode = computed(() => route.name === 'patient-new')
const id = ref<string | null>((route.params.id as string) || null)
const vid = ref<string | null>((route.params.vid as string) || null)
const createdPatientId = ref<string | null>(null)
const createdVisitVid = ref<string | null>(null)
const pendingPatientPayload = ref<{ patient?: PatientDetails; photoFile?: File | null } | null>(null)

const activeSection = ref('patient')
const patient = ref<Patient | null>(null)
const name = ref('')
const age = ref<number | null>(null)
const regDate = ref('')
const queueNo = ref('')
const showRecords = ref(false)
const tryDeleteVisit = ref(false)
const tryDeletePatient = ref(false)
const tryReload = ref(false)
const visitCount = ref(0)
const patientMeta = ref<PatientMeta | null>(null)

const activeSectionStorageKey = computed(() => {
  const patientId = id.value ?? createdPatientId.value
  const visitId = vid.value ?? createdVisitVid.value
  if (!patientId || !visitId) return null
  return `patient-record:active-section:${patientId}:${visitId}`
})

const componentMap: Record<string, any> = {
  patient: PatientModal,
  admin: AdminModal,
  'past-med-hist': PastMedHistModal,
  'social-hist': SocialHistModal,
  'vital-stats': VitalStatsModal,
  'height-weight': HeightWeightModal,
  'visual-acuity': VisualAcuityModal,
  'fall-risk': FallRiskModal,
  dental: DentalModal,
  'dr-consult': DrConsultModal,
  'add-new-visit': AddNewVisitModal,
  physiotherapy: PhysiotherapyModal,
  prescriptions: PrescriptionModal
}

const activeComponent = computed(() => componentMap[activeSection.value] || PatientModal)

function clearPersistedState() {
  const storageKey = activeSectionStorageKey.value

  if (typeof window === 'undefined') return

  if (storageKey) {
    localStorage.removeItem(storageKey)
  }
}

watch(
  activeSectionStorageKey,
  (key) => {
    if (!key || typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(key)
      if (stored && stored in componentMap) {
        activeSection.value = stored
      }
    } catch (err) {
      console.warn('[PatientRecordPage] Failed to read active section from localStorage', err)
    }
  },
  { immediate: true }
)

watch(activeSection, (section) => {
  const storageKey = activeSectionStorageKey.value
  if (storageKey && typeof window !== 'undefined' && section in componentMap) {
    try {
      localStorage.setItem(storageKey, section)
    } catch (err) {
      console.warn('[PatientRecordPage] Failed to persist active section', err)
    }
  }
})

watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    if (newPath === oldPath) return
    clearPersistedState()
  }
)

function setActiveSection(section: string) {
  if (isCreateMode.value) {
    const hasPatient = !!(id.value ?? createdPatientId.value)
    const hasVisit = !!(vid.value ?? createdVisitVid.value)
    const allowed =
      section === 'patient' ||
      (section === 'admin' && hasPatient) ||
      (!['patient', 'admin'].includes(section) && hasPatient && hasVisit)
    if (!allowed) return
  }
  activeSection.value = section
}

async function loadPatientData() {
  if (!id.value || !vid.value) return
  try {
    const data = await fetchPatientRecord(id.value, vid.value)
    patient.value = structuredClone(data)
    const admin = patient.value.admin
    const patientInfo = patient.value.patientDetails
    age.value = calculateAge(patientInfo?.dob)
    name.value = patientInfo?.name ?? ''
    regDate.value = admin?.regDate ? formatDateForInput(admin.regDate as any) : ''
    queueNo.value = admin?.queueNo ?? ''
    await loadPatientMeta(id.value)
  } catch (e) {
    console.error(e)
    toast.error('Failed to load patient data')
  }
}

async function loadPatientMeta(pid: string) {
  try {
    const meta = await fetchPatientMeta(pid)
    patientMeta.value = meta
    visitCount.value = Object.keys(meta.visits || {}).length
  } catch (e) {
    console.error(e)
    patientMeta.value = null
    visitCount.value = 0
  }
}

function formatDateForInput(dateInput: string | Date) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function handlePatientCreated(evt: { id: string; patientDetails: PatientDetails; age: number | null }) {
  createdPatientId.value = evt.id ? String(evt.id) : null
  name.value = evt.patientDetails.name
  age.value = evt.age
  // Seed patient data so downstream forms have gender/id immediately
  patient.value = {
    ...(patient.value || {}),
    patientDetails: evt.patientDetails
  } as Patient
  visitCount.value = 0
  patientMeta.value = null
  activeSection.value = 'admin'
}

function capturePatientPayload(details: PatientDetails, photoFile?: File | null) {
  pendingPatientPayload.value = { patient: details, photoFile: photoFile ?? null }
}

type PatientUpdatedPayload = {
  id?: string
  patientDetails?: Patient['patientDetails']
  age?: number | null
}

function handlePatientUpdated(evt: PatientUpdatedPayload) {
  if (evt.patientDetails) {
    name.value = evt.patientDetails.name
    if (patient.value) {
      patient.value.patientDetails = { ...patient.value.patientDetails, ...evt.patientDetails }
    }
  }
  if (typeof evt.age !== 'undefined') {
    age.value = evt.age
  }
}

async function handlePatientVisitCreated(evt: any) {
  if (evt.regDate) regDate.value = evt.regDate
  if (evt.queueNo) queueNo.value = evt.queueNo
  createdVisitVid.value = evt.vid
  if (id.value || evt.id) {
    await loadPatientMeta(String(id.value || evt.id))
  }
  pendingPatientPayload.value = null
  await router.push(`/patient/${evt.id}/${evt.vid}`)
  activeSection.value = 'admin'
}

function handleAdminUpdated(evt: { regDate: string | null; queueNo: string | null }) {
  if (evt.regDate) regDate.value = evt.regDate
  if (evt.queueNo) queueNo.value = evt.queueNo
  if (patient.value?.admin) {
    patient.value.admin = {
      ...patient.value.admin,
      regDate: (evt.regDate as any) ?? patient.value.admin.regDate,
      queueNo: evt.queueNo ?? patient.value.admin.queueNo
    }
  }
}

function openRecords() {
  showRecords.value = true
}
function closeRecords() {
  showRecords.value = false
}

async function handleDeleteVisit() {
  if (!id.value || !vid.value) return
  try {
    await deletePatientVisit(id.value, vid.value)
    toast.success('Patient visit deleted')
    await router.push('/patient-directory')
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete visit')
  } finally {
    tryDeleteVisit.value = false
  }
}

async function handleDeletePatient() {
  if (!id.value) return
  try {
    await deletePatient(id.value)
    toast.success('Patient deleted')
    await router.push('/patient-directory')
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete patient')
  } finally {
    tryDeletePatient.value = false
  }
}

function handleReloadConfirm() {
  loadPatientData()
  tryReload.value = false
}

onMounted(() => {
  if (!isCreateMode.value) {
    loadPatientData()
  } else {
    activeSection.value = 'patient'
  }
})

watch(
  () => [route.params.id, route.params.vid],
  ([newId, newVid], [oldId, oldVid]) => {
    if (newId === oldId && newVid === oldVid) return

    id.value = (newId as string) ?? null
    vid.value = (newVid as string) ?? null

    if (!isCreateMode.value && id.value && vid.value) {
      loadPatientData()
    }
  }
)

// Clear patient data when entering create mode
watch(isCreateMode, (isCreate) => {
  if (isCreate) {
    patient.value = null
    name.value = ''
    age.value = null
    regDate.value = ''
    queueNo.value = ''
    patientMeta.value = null
    visitCount.value = 0
    pendingPatientPayload.value = null
    activeSection.value = 'patient'
  }
})

onBeforeUnmount(() => {
  clearPersistedState()
})
</script>

<style scoped></style>
