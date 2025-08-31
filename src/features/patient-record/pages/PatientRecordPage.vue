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
            @patientCreated="handlePatientCreated"
            @patientUpdated="handlePatientUpdated"
            @patientVisitCreated="handlePatientVisitCreated"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import SideBar from '@shared/ui/navigation/SideBar.vue'
import SubNavBar from '@shared/ui/navigation/SubNavBar.vue'
import RecordsModal from '@features/patient-record/components/RecordsModal.vue'
import AdminModal from '@features/patient-record/components/AdminModal.vue'
import PastMedHistModal from '@features/patient-record/components/PastMedHistModal.vue'
import SocialHistModal from '@features/patient-record/components/SocialHistModal.vue'
import VitalStatsModal from '@features/patient-record/components/VitalStatsModal.vue'
import HeightWeightModal from '@features/patient-record/components/HeightWeightModal.vue'
import VisualAcuityModal from '@features/patient-record/components/VisualAcuityModal.vue'
import FallRiskModal from '@features/patient-record/components/FallRiskModal.vue'
import DrConsultModal from '@features/patient-record/components/DrConsultModal.vue'
import PhysiotherapyModal from '@features/patient-record/components/PhysiotherapyModal.vue'
import AddNewVisitModal from '@features/patient-record/components/AddNewVisitModal.vue'
import DentalModal from '@features/patient-record/components/DentalModal.vue'
import PrescriptionModal from '@features/patient-record/components/PrescriptionModal.vue'
import { fetchPatientRecord, deletePatientVisit } from '@features/patient-record/api/patient'
import type Patient from '@features/patient-record/types/Patient'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isCreateMode = computed(() => route.name === 'patient-new')
const id = ref<string | null>((route.params.id as string) || null)
const vid = ref<string | null>((route.params.vid as string) || null)
const createdPatientId = ref<string | null>(null)
const createdVisitVid = ref<string | null>(null)

const activeSection = ref('admin')
const patient = ref<Patient | null>(null)
const name = ref('')
const age = ref<number | null>(null)
const regDate = ref('')
const queueNo = ref('')
const showRecords = ref(false)
const tryDeleteVisit = ref(false)
const tryReload = ref(false)

const componentMap: Record<string, any> = {
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

const activeComponent = computed(() => componentMap[activeSection.value] || AdminModal)

function setActiveSection(section: string) {
  // In create mode restrict to admin until created
  if (isCreateMode.value && section !== 'admin') return
  activeSection.value = section
}

async function loadPatientData() {
  if (!id.value || !vid.value) return
  try {
    const data = await fetchPatientRecord(id.value, vid.value)
    patient.value = structuredClone(data)
    const admin = patient.value.admin
    age.value = admin.dob ? new Date().getFullYear() - new Date(admin.dob).getFullYear() : null
    name.value = admin.name
    regDate.value = formatDateForInput(admin.regDate)
    queueNo.value = admin.queueNo
  } catch (e) {
    console.error(e)
    toast.error('Failed to load patient data')
  }
}

function formatDateForInput(dateString: string) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function handlePatientCreated(evt: { id: string; vid: number; name: string; age: number | null }) {
  createdPatientId.value = String(evt.id)
  createdVisitVid.value = String(evt.vid)
  // switch to view mode route
  router.replace(`/patients/${evt.id}/${evt.vid}`)
}

function handlePatientUpdated(evt: any) {
  name.value = evt.name
  age.value = evt.age
  regDate.value = evt.regDate
  queueNo.value = evt.queueNo
}

function handlePatientVisitCreated(evt: any) {
  router.push(`/patients/${evt.id}/${evt.vid}`)
  activeSection.value = 'admin'
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
    router.push('/patient-directory')
  } catch (e) {
    console.error(e)
    toast.error('Failed to delete visit')
  } finally {
    tryDeleteVisit.value = false
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
  () => route.params.vid,
  (newVid) => {
    if (!isCreateMode.value) {
      vid.value = newVid as string
      loadPatientData()
    }
  }
)
</script>

<style scoped></style>
