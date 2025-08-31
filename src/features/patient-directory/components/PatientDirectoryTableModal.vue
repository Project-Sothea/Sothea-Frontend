<template>
  <div class="container max-w-3xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <div class="flex flex-row justify-between w-full mb-1 sm:mb-0">
        <h2 class="text-3xl leading-tight" style="color: black">Patient Directory</h2>
      </div>

      <div class="flex justify-between items-center py-5">
        <div class="relative flex-grow">
          <input
            type="text"
            id="search-input"
            class="rounded-lg border-transparent appearance-none w-[25rem] bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="Search by ID/Name/Khmer Name/Reg Date/Contact No."
            @input="searchPatient"
            @keyup.enter="searchPatient"
          />
        </div>
        <div class="flex items-center space-x-3 mx-5 hover:cursor-pointer">
          <p style="font-size: medium" class="hover:text-gray-500" @click="exportPatientData()">
            Export Patient Data &#x2913;
          </p>
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
                  class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase border-b border-gray-200 hover:cursor-pointer"
                  style="background: rgba(63, 81, 181, 0.3)"
                  @click="sortById"
                >
                  Patient ID &udarr;
                </th>
                <th
                  scope="col"
                  class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Reg Date
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
                  Family Group
                </th>
                <th
                  scope="col"
                  class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                  style="background: rgba(63, 81, 181, 0.3)"
                >
                  Contact No.
                </th>
              </tr>
            </thead>
            <tbody>
              <TableRow
                class="hover:cursor-pointer"
                v-for="(patientVisit, index) in patientVisits"
                :key="patientVisit.id"
                :id="String(patientVisit.id)"
                :vid="String(patientVisit.vid)"
                :regDate="patientVisit.regDate"
                :name="patientVisit.name"
                :khmerName="patientVisit.khmerName"
                :gender="patientVisit.gender"
                :familyGroup="patientVisit.familyGroup"
                :contactNumber="patientVisit.contactNo"
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
import { onMounted, ref } from 'vue'
import TableRow from '@features/patient-directory/components/PatientDirectoryTableRow.vue'
import { fetchDirectoryDefault, exportPatientDirectory } from '@patient-directory/api/directory'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type PatientVisitMeta from '@patient-record/types/PatientVisitMeta'

const toast = useToast()

const patientVisits = ref<PatientVisitMeta[]>([])
const patientVisitsFixed = ref<PatientVisitMeta[]>([]) // For searching patientVisits
const sortAscId = ref(true)

async function getData() {
  try {
    const data = await fetchDirectoryDefault()
    patientVisits.value = data
    patientVisitsFixed.value = data
  } catch (error) {
    console.error(error)
    toast.error('Failed to load patient directory')
  }
}

async function exportPatientData() {
  try {
    const response = await exportPatientDirectory(false)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'patientdata.csv')
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error: any) {
    toast.error(error.response?.data?.error || 'An internal server error occurred.')
  }
}

function searchPatient() {
  const input = document.getElementById('search-input') as HTMLInputElement | null
  // get value of the search input
  const searchValue = input?.value.toLowerCase() ?? ''
  // refresh the table of patientVisits
  if (!searchValue) {
    getData()
    return
  }
  // filter patientVisits array based on the search value
  patientVisits.value = patientVisitsFixed.value.filter((patientVisit) => {
    return (
      patientVisit.name?.toLowerCase().includes(searchValue) ||
      patientVisit.id?.toString().includes(searchValue) ||
      patientVisit.khmerName?.toLowerCase().includes(searchValue) ||
      patientVisit.contactNo?.includes(searchValue) ||
      searchByRegDate(patientVisit.regDate, searchValue)
    )
  })
}

function searchByRegDate(regDate: string, searchValue: string): boolean {
  // regDate is in ISO format, UTC timezone
  const regDateString = new Date(regDate) // convert to local timezone Date object

  const year = regDateString.getFullYear()
  const month = String(regDateString.getMonth() + 1).padStart(2, '0')
  const day = String(regDateString.getDate()).padStart(2, '0')
  const regDateFormattedSlash = `${day}/${month}/${year}`
  const regDateFormattedDash = `${day}-${month}-${year}`

  return regDateFormattedSlash.includes(searchValue) || regDateFormattedDash.includes(searchValue)
}
function sortById() {
  patientVisits.value.sort((a, b) => {
    const aId = a.id ?? 0
    const bId = b.id ?? 0
    return sortAscId.value ? aId - bId : bId - aId
  })
  sortAscId.value = !sortAscId.value
}
// Fetch data on component mount
onMounted(() => {
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
