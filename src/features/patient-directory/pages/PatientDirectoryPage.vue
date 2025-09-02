<template>
  <NavBar />
  <div class="container max-w-3xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <div class="flex flex-row justify-between w-full mb-1 sm:mb-0">
        <h2 class="text-3xl leading-tight" style="color: black">Patient Directory</h2>
      </div>

      <PatientDirectoryToolbar
        @search="handleSearch"
        @export="exportPatientData"
        @refresh="getData"
      />

      <hr class="line" />

      <PatientDirectoryTable
        :items="patientVisits"
        :sort-key="sortState.key"
        :sort-asc="sortState.asc"
        @sortById="sortById"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NavBar from '@shared/ui/navigation/NavBar.vue'
import PatientDirectoryToolbar from '@patient-directory/components/PatientDirectoryToolbar.vue'
import PatientDirectoryTable from '@patient-directory/components/PatientDirectoryTable.vue'
import { fetchDirectoryDefault, exportPatientDirectory } from '@patient-directory/api/directory'
import { matchDateDMY } from '@shared/utils/date'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'

const toast = useToast()
const patientVisits = ref<PatientVisitMeta[]>([])
const patientVisitsFixed = ref<PatientVisitMeta[]>([])
const sortState = ref<{ key: null | 'id'; asc: boolean }>({ key: null, asc: true })

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

function handleSearch(raw: string) {
  const searchValue = raw.toLowerCase()
  if (!searchValue) {
    patientVisits.value = [...patientVisitsFixed.value]
    return
  }
  patientVisits.value = patientVisitsFixed.value.filter(
    (pv) =>
      pv.name?.toLowerCase().includes(searchValue) ||
      pv.id?.toString().includes(searchValue) ||
      pv.khmerName?.toLowerCase().includes(searchValue) ||
      pv.contactNo?.includes(searchValue) ||
      matchDateDMY(pv.regDate, searchValue)
  )
}

function sortById() {
  if (sortState.value.key === 'id') {
    sortState.value.asc = !sortState.value.asc
  } else {
    sortState.value.key = 'id'
    // Start descending so first click shows movement
    sortState.value.asc = false
  }
  applySort()
}

function applySort() {
  const { key, asc } = sortState.value
  if (!key) return
  patientVisits.value = [...patientVisits.value].sort((a, b) => {
    const aId = a.id ?? 0
    const bId = b.id ?? 0
    return asc ? aId - bId : bId - aId
  })
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
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
