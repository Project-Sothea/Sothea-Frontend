<template>
  <NavBar />
  <div class="container max-w-3xl px-4 mx-auto sm:px-8 table">
    <div class="py-8">
      <div class="flex flex-row justify-between w-full mb-1 sm:mb-0">
        <h2 class="text-3xl leading-tight" style="color: black">Patient Queue</h2>
      </div>
      <PatientQueueToolbar
        :search="searchTerm"
        :date="dateInput"
        :max-date="maxDate"
        @search="handleSearch"
        @date-change="handleDateChange"
        @refresh="getData"
      />
      <hr class="line" />
      <PatientQueueTable
        :items="patientVisits"
        :sort-key="sortState.key"
        :sort-asc="sortState.asc"
        @sort-id="sortById"
        @sort-referral="sortByReferral"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@shared/ui/navigation/NavBar.vue'
import PatientQueueToolbar from '../components/PatientQueueToolbar.vue'
import PatientQueueTable from '../components/PatientQueueTable.vue'
import { ref, onMounted } from 'vue'
import { formatDateISO } from '@shared/utils/date'
import { fetchPatientVisitMetaByDate } from '@features/patient-queue/api/queue'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const toast = useToast()

const patientVisits = ref<PatientVisitMeta[]>([])
const patientVisitsFixed = ref<PatientVisitMeta[]>([])
// Unified sort state so we can reapply after data reload/filter
const sortState = ref<{ key: null | 'id' | 'referral'; asc: boolean }>({ key: null, asc: true })
const dateInput = ref('')
const maxDate = ref(formatDateISO(new Date()))
const searchTerm = ref('')

async function getData() {
  try {
    const storedDate = localStorage.getItem('date-input')
    const dateToRetrieve = storedDate || formatDateISO(new Date())
    const data = await fetchPatientVisitMetaByDate(dateToRetrieve)
    patientVisits.value = data
    patientVisitsFixed.value = data
    handleSearch(searchTerm.value, { skipSort: true })
    applySort()
  } catch (e) {
    console.error(e)
    toast.error('Failed to load patient queue')
  }
}

function handleSearch(val: string, opts: { skipSort?: boolean } = {}) {
  searchTerm.value = val
  const term = val.trim().toLowerCase()
  if (!term) {
    patientVisits.value = [...patientVisitsFixed.value]
  } else {
    patientVisits.value = patientVisitsFixed.value.filter(
      (p) =>
        p.queueNo?.toLowerCase().includes(term) ||
        p.name?.toLowerCase().includes(term) ||
        p.id?.toString().includes(term) ||
        p.khmerName?.toLowerCase().includes(term) ||
        (p.drugAllergies ?? '').toLowerCase().includes(term)
    )
  }
  if (!opts.skipSort) applySort()
}

function sortById() {
  if (sortState.value.key === 'id') {
    sortState.value.asc = !sortState.value.asc
  } else {
    // First click on a new column: start with descending so user sees an immediate change
    sortState.value.key = 'id'
    sortState.value.asc = false
  }
  applySort()
}

function sortByReferral() {
  if (sortState.value.key === 'referral') {
    sortState.value.asc = !sortState.value.asc
  } else {
    sortState.value.key = 'referral'
    sortState.value.asc = false
  }
  applySort()
}

function applySort() {
  const { key, asc } = sortState.value
  if (!key) return
  patientVisits.value = [...patientVisits.value].sort((a, b) => {
    if (key === 'id') {
      const aId = a.id ?? 0
      const bId = b.id ?? 0
      return asc ? aId - bId : bId - aId
    }
    // referral
    const av = !!a.referralNeeded
    const bv = !!b.referralNeeded
    if (av === bv) return 0
    if (asc) return av ? 1 : -1
    return av ? -1 : 1
  })
}

async function handleDateChange(val: string) {
  dateInput.value = val
  localStorage.setItem('date-input', val)
  try {
    const data = await fetchPatientVisitMetaByDate(val)
    patientVisits.value = data
    patientVisitsFixed.value = data
    handleSearch(searchTerm.value, { skipSort: true })
    applySort()
  } catch (e) {
    console.error(e)
    toast.error('Failed to filter by date')
  }
}

onMounted(() => {
  const storedDate = localStorage.getItem('date-input')
  dateInput.value = storedDate || formatDateISO(new Date())
  getData()
})
</script>

<style>
.table {
  width: 1240px;
}
.line {
  height: 1px;
  background: rgba(0, 0, 0, 0.17);
}
.even-row {
  background: #ffffff;
}
.odd-row {
  background: #f2f2f2;
}
</style>
