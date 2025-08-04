<template>
  <div>
    <NavBar />
    <!-- Reload Page Confirmation Modal -->
    <div
      v-if="tryReload"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
    >
      <div
        class="bg-white rounded-lg p-10 max-w-full overflow-y-auto"
        style="max-height: 95%; max-width: 60%"
      >
        <!-- Confirmation Message -->
        <div class="text-center text-lg text-gray-800 mb-6 mt-10">
          Are you sure you want to reload? Any unsaved changes will be overwritten.
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-10 my-10">
          <button
            @click="handleReloadConfirm"
            class="bg-[#3f51b5] hover:bg-[#5c6cc4] text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Yes
          </button>
          <button
            @click="tryReload = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-md transition-colors duration-200"
          >
            No
          </button>
        </div>
      </div>
    </div>

    <div class="flex">
      <SideBar
        :activeSection="activeSection"
        :id="id"
        :name="name"
        :age="age ? age : undefined"
        @update:activeSection="setActiveSection"
        @openTryDeleteVisitModal="tryDeleteVisit = true"
        :isAdd="false"
      />
      <div class="flex-grow">
        <SubNavBar
          :id="id"
          :regDate="regDate"
          :queueNo="queueNo"
          @openModal="openRecords"
          @refresh="tryReload = true"
        />
        <keep-alive>
          <component
            :is="activeComponent"
            :patientId="String(id)"
            :patientVid="String(vid)"
            :patientData="patient"
            :isAdd="false"
            @reload="loadPatientData"
            @patientUpdated="handlePatientUpdated"
            @patientVisitCreated="handlePatientVisitCreated"
          >
          </component>
        </keep-alive>
      </div>
    </div>
    <!-- Records Modal -->
    <RecordsModal :id="id" :vid="vid" :isOpen="showRecords" @close="closeRecords"> </RecordsModal>

    <!-- Delete Visit Confirmation Modal -->
    <div
      v-if="tryDeleteVisit"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 max-h-full max-w-full"
    >
      <div
        class="bg-white rounded-lg p-10 max-w-full overflow-y-auto"
        style="max-height: 95%; max-width: 60%"
      >
        <!-- Confirmation Message -->
        <div class="text-center text-lg text-gray-800 mb-6 mt-10">
          Are you sure you want to delete this patient visit?
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-10 my-10">
          <button
            @click="handleDeleteVisit"
            class="bg-[#3f51b5] hover:bg-[#5c6cc4] text-white font-bold py-2 px-6 rounded-md transition-colors duration-200"
          >
            Yes
          </button>
          <button
            @click="tryDeleteVisit = false"
            class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-6 rounded-md transition-colors duration-200"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import SideBar from '../components/SideBar.vue'
import NavBar from '../components/NavBar.vue'
import SubNavBar from '../components/SubNavBar.vue'
import RecordsModal from '../components/RecordsModal.vue'

import AdminModal from '../components/AdminModal.vue'
import PastMedHistModal from '../components/PastMedHistModal.vue'
import SocialHistModal from '../components/SocialHistModal.vue'
import VitalStatsModal from '../components/VitalStatsModal.vue'
import HeightWeightModal from '../components/HeightWeightModal.vue'
import VisualAcuityModal from '../components/VisualAcuityModal.vue'
import FallRiskModal from '@/components/FallRiskModal.vue'
import DrConsultModal from '../components/DrConsultModal.vue'
import PhysiotherapyModal from '@/components/PhysiotherapyModal.vue'
import AddNewVisitModal from '@/components/AddNewVisitModal.vue'
import DentalModal from '@/components/DentalModal.vue'
import PrescriptionModal from '@/components/PrescriptionModal.vue'

import type Patient from '@/types/Patient'

import axios, { AxiosError, type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { BaseURL } from '@/main'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  id: string
  vid: string
}>()

const router = useRouter()
const route = useRoute()
const toast = useToast()

const activeSection = ref('admin')
const patient = ref<Patient | null>(null)
const name = ref('')
const age = ref<number | null>(null)
const regDate = ref('')
const queueNo = ref('')
const showRecords = ref(false)
const tryDeleteVisit = ref(false)
const tryReload = ref(false)

const activeComponent = computed(() => {
  const map: Record<string, any> = {
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
  return map[activeSection.value] || AdminModal
})

function setActiveSection(section: string) {
  activeSection.value = section
}

async function getPatientData(id: string, vid: string) {
  const response: AxiosResponse = await axios.get(`${BaseURL}/patient/${id}/${vid}`)
  const { data } = response
  patient.value = JSON.parse(JSON.stringify(data)) as Patient

  const admin = patient.value.admin
  age.value = admin.dob ? new Date().getFullYear() - new Date(admin.dob).getFullYear() : null
  name.value = admin.name
  regDate.value = formatDateForInput(admin.regDate)
  queueNo.value = admin.queueNo
}

function formatDateForInput(dateString: string) {
  const date = new Date(dateString)

  // Get the date components (year, month, day) of date in local timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Return the formatted date string
  return `${year}-${month}-${day}`
}

async function loadPatientData() {
  const toast = useToast()
  try {
    await getPatientData(props.id, props.vid)
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError // Safe casting
      if (axiosError.response) {
        // The request was made and server responded with a status code out of range 2xx
        console.log(axiosError.response.data)
        toast.error(axiosError.message)
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request)
        toast.error('No server response received, check your connection.')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', axiosError.message)
        toast.error('An internal server error occurred.')
      }
    } else {
      // No response received at all
      toast.error('An internal server error occurred.')
    }
  }
}

function handlePatientUpdated(event: any) {
  const { id, name, age, vid, regDate, queueNo } = event
  console.log(
    `Patient Updated With ID: ${id}, Name: ${name}, Age: ${age}, VID: ${vid}, Reg Date: ${regDate}, Queue No: ${queueNo}`
  )
  name.value = name
  age.value = age
  regDate.value = regDate
  queueNo.value = queueNo
}
function handlePatientVisitCreated(event: any) {
  const { id, name, age, vid } = event
  console.log(`Patient Created Wth ID: ${id}, Name: ${name}, Age: ${age}, VID: ${vid}`)
  router.push('/patient/' + id + '/' + vid)
  setActiveSection('admin') // go back to admin modal
}
function openRecords() {
  showRecords.value = true
}
function closeRecords() {
  showRecords.value = false
}
async function handleDeleteVisit() {
  try {
    await axios.delete(`${BaseURL}/patient/${props.id}/${props.vid}`)
    router.push('/allpatients')
    toast.success('Patient Visit deleted successfully.')
  } catch (error: unknown) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError // Safe casting

      if (axiosError.response) {
        // Server responded with a status code outside of the 2xx range
        console.log(axiosError.response.data)
        toast.error(axiosError.message || 'Failed to delete the visit')
      } else if (axiosError.request) {
        // Request was made but no response received (e.g., server is down)
        console.log(axiosError.request)
        toast.error('No server response received, check your connection.')
      } else {
        // Error occurred in setting up the request
        console.log('Error', axiosError.message)
        toast.error('An internal server error occurred.')
      }
    } else {
      // Handle unknown errors (not axios related)
      console.log(error)
      toast.error('An internal server error occurred.')
    }
  }
}

function handleReloadConfirm() {
  loadPatientData()
  tryReload.value = false
}

onMounted(() => {
  loadPatientData()
})

watch(
  () => route.params.vid,
  () => {
    loadPatientData()
  }
)
</script>

<style scoped>
.bar {
  background-color: #3f51b5;
  padding: 1rem;
  width: 100%;
  color: white;
  font-weight: 500;
  padding-left: 1.5rem;
}
</style>
