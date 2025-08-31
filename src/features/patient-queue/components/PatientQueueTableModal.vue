<template>
  <div class="container max-w-3xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <div class="flex flex-row justify-between w-full mb-1 sm:mb-0">
        <h2 class="text-3xl leading-tight" style="color: black">Patient Queue</h2>
      </div>

      <div class="flex justify-between items-center py-5">
        <div class="relative flex-grow flex flex-row">
          <div class="mr-2">
            <input
              type="text"
              id="search-input"
              class="rounded-lg border-transparent appearance-none w-[26rem] bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Search by Queue No/ID/Name/Khmer Name/Drug Allergies"
              @input="searchPatient"
              @keyup.enter="searchPatient"
            />
          </div>
          <div>
            <input
              type="date"
              id="date-input"
              class="rounded-lg border-transparent appearance-none w-48 bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              v-model="dateInput"
              @input="filterPatientsByDate()"
              :max="maxDate"
            />
          </div>
        </div>
        <div class="flex items-center space-x-3 hover:cursor-pointer">
          <p style="font-size: medium" class="hover:text-gray-500" @click="getData()">
            Refresh List &#x21bb;
          </p>
        </div>
      </div>

      <hr class="line" />

      <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 table">
        <div class="inline-block min-w-full overflow-hidden shadow table">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="px-4 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Queue No.
                </th>
                <th
                  scope="col"
                  class="px-4 py-5 text-sm font-medium text-left text-gray-800 uppercase border-b border-gray-200 hover:cursor-pointer"
                  style="background: rgba(63, 81, 181, 0.3)"
                  @click="sortById"
                >
                  Patient ID &udarr;
                </th>
                <th
                  scope="col"
                  class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Patient Name
                </th>
                <th
                  scope="col"
                  class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Khmer Name
                </th>
                <th
                  scope="col"
                  class="px-3 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Allergies
                </th>
                <th
                  scope="col"
                  class="px-7 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                  @click="sortByReferral"
                >
                  Referral &udarr;
                </th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                class="hover:cursor-pointer"
                v-for="(patientVisit, index) in patientVisits"
                :key="patientVisit.id"
                :queueNo="patientVisit.queueNo"
                :id="String(patientVisit.id)"
                :vid="String(patientVisit.vid)"
                :name="patientVisit.name"
                :khmername="patientVisit.khmerName"
                :gender="patientVisit.gender"
                :allergies="patientVisit.drugAllergies"
                :referralneeded="patientVisit.referralNeeded"
                :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TableRow from './PatientQueueTableRow.vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { fetchPatientVisitMetaByDate } from '@features/patient-queue/api/queue'
import type PatientVisitMeta from '@features/patient-record/types/PatientVisitMeta'

const toast = useToast()

const patientVisits = ref<PatientVisitMeta[]>([]) // Array to hold patient visit data
const patientVisitsFixed = ref<PatientVisitMeta[]>([]) // For searching patient visits
const sortAscId = ref(true) // State for sorting by ID
const sortAscReferral = ref(true) // State for sorting by referral
const dateInput = ref('') // Date input for filtering
const maxDate = ref(formatDateForInput(new Date()))

async function getData() {
  try {
    const storedDate = localStorage.getItem('date-input')
    const dateToRetrieve = storedDate
      ? convertLocalToUTC(new Date(storedDate))
      : convertLocalToUTC(new Date()) // Default to today if no stored date
    const data = await fetchPatientVisitMetaByDate(dateToRetrieve)
    patientVisits.value = data
    patientVisitsFixed.value = data
  } catch (error) {
    console.error(error)
    toast.error('Failed to load patient queue')
  }
}

function searchPatient() {
  const input = document.getElementById('search-input') as HTMLInputElement | null
  const searchValue = input?.value.toLowerCase() ?? ''
  if (!searchValue) {
    getData()
    return
  }

  patientVisits.value = patientVisitsFixed.value.filter((patient: PatientVisitMeta) => {
    return (
      patient.queueNo?.toLowerCase().includes(searchValue) ||
      patient.name?.toLowerCase().includes(searchValue) ||
      patient.id?.toString().includes(searchValue) ||
      patient.khmerName?.toLowerCase().includes(searchValue) ||
      (patient.drugAllergies ?? '').toLowerCase().includes(searchValue)
    )
  })
}

async function filterPatientsByDate() {
  try {
    localStorage.setItem('date-input', dateInput.value)
    const dateToRetrieve = convertLocalToUTC(new Date(dateInput.value))
    const data = await fetchPatientVisitMetaByDate(dateToRetrieve)
    patientVisits.value = data
    patientVisitsFixed.value = data
  } catch (error) {
    console.error(error)
    toast.error('Failed to filter by date')
  }
}

function sortById() {
  patientVisits.value.sort((a: PatientVisitMeta, b: PatientVisitMeta) => {
    const aId = a.id ?? 0
    const bId = b.id ?? 0
    return sortAscId.value ? aId - bId : bId - aId
  })
  sortAscId.value = !sortAscId.value
}

function sortByReferral() {
  patientVisits.value.sort((a: PatientVisitMeta, b: PatientVisitMeta) => {
    const referralA = a.referralNeeded ?? null
    const referralB = b.referralNeeded ?? null

    if (referralA === referralB) return 0

    if (sortAscReferral.value) {
      return referralA === null ? 1 : referralB === null ? -1 : referralA < referralB ? -1 : 1
    } else {
      return referralA === null ? 1 : referralB === null ? -1 : referralA > referralB ? -1 : 1
    }
  })
  sortAscReferral.value = !sortAscReferral.value
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

function convertLocalToUTC(date: Date) {
  return date.toISOString().split('T')[0] // Convert to ISO string and extract the date part
}
onMounted(() => {
  const storedDate = localStorage.getItem('date-input')
  dateInput.value = storedDate || formatDateForInput(new Date())
  getData()
})
</script>

<style>
.table {
  width: 1240px;
}

.table-heading {
  background: rgba(63, 81, 181);
}

.line {
  height: 1px;
  background: rgba(0, 0, 0, 0.17);
}

.even-row {
  background-color: #ffffff;
}

.odd-row {
  background-color: #f2f2f2;
}
</style>
