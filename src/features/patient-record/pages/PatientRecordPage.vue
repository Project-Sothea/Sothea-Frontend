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
import type Patient from '@patient-record/types/Patient'
import type PatientDetails from '@patient-record/types/PatientDetails'
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
    const patientInfo = patient.value.patientdetails
    age.value = calculateAge(patientInfo?.dob)
    name.value = patientInfo?.name ?? ''
    regDate.value = admin?.regDate ? formatDateForInput(admin.regDate as any) : ''
    queueNo.value = admin?.queueNo ?? ''
  } catch (e) {
    console.error(e)
    toast.error('Failed to load patient data')
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

function handlePatientCreated(evt: { id: string; patientdetails: PatientDetails; age: number | null }) {
  createdPatientId.value = String(evt.id)
  name.value = evt.patientdetails.name
  age.value = evt.age
  activeSection.value = 'admin'
}

type PatientUpdatedPayload = {
  id?: string
  patientdetails?: Patient['patientdetails']
  age?: number | null
}

function handlePatientUpdated(evt: PatientUpdatedPayload) {
  if (evt.patientdetails) {
    name.value = evt.patientdetails.name
    if (patient.value) {
      patient.value.patientdetails = { ...patient.value.patientdetails, ...evt.patientdetails }
    }
  }
  if (typeof evt.age !== 'undefined') {
    age.value = evt.age
  }
}

function handlePatientVisitCreated(evt: any) {
  if (evt.regDate) regDate.value = evt.regDate
  if (evt.queueNo) queueNo.value = evt.queueNo
  createdVisitVid.value = evt.vid
  router.push(`/patient/${evt.id}/${evt.vid}`)
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
  if (!isCreateMode.value) loadPatientData()
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
  }
})

onBeforeUnmount(() => {
  clearPersistedState()
})
</script>

<style scoped></style>
