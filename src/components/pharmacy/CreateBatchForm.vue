<template>
  <div class="container max-w-lg mx-auto mt-10 p-6 shadow rounded bg-white">
    <h2 class="text-2xl font-semibold mb-6">Create Batch</h2>

    <form @submit.prevent="handleSubmit(() => router.back())">
      <!-- ─────────── DRUG COMBOBOX ─────────── -->
      <label ref="comboRef" class="block mb-4 relative">
        <span class="text-gray-700">Drug <span class="text-red-600">*</span></span>

        <!-- typed input -->
        <input
          v-model.trim="drugQuery"
          @focus="showDropdown = true"
          @input="onQueryInput"
          placeholder="Search drug…"
          :class="inputClass(errors.drug)"
          class="mt-1 w-full"
          autocomplete="off"
        />

        <!-- dropdown -->
        <ul
          v-if="showDropdown"
          class="absolute z-20 bg-white border border-gray-300 rounded shadow w-full mt-1 max-h-48 overflow-auto"
        >
          <li
            v-for="d in filteredDrugs"
            :key="d.id"
            @click="selectDrug(d)"
            class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
          >
            {{ d.name }}
            <span class="text-gray-500 text-xs">({{ d.unit }})</span>
          </li>

          <li
            @click="selectNewDrug"
            class="px-3 py-2 cursor-pointer hover:bg-green-100 text-green-700 font-semibold border-t"
          >
            ➕ Create new drug…
          </li>
        </ul>

        <p v-if="errors.drug" class="err">{{ errors.drug }}</p>
      </label>

      <p v-if="currentDrug" class="mb-4 text-sm text-gray-600">
        Unit: <strong>{{ currentDrug.unit }}</strong>
      </p>

      <CreateDrugForm v-if="selectedDrugId === NEW_DRUG_ID" @created="onDrugCreated" />

      <!-- Batch No. -->
      <label class="block mb-4">
        <span class="text-gray-700">Batch&nbsp;No. <span class="text-red-600">*</span></span>
        <input
          v-model.trim="batch.batch_no"
          :class="inputClass(errors.batch_no)"
          @input="clearError('batch_no')"
          type="text"
          autocomplete="off"
          required
        />
        <p v-if="errors.batch_no" class="err">{{ errors.batch_no }}</p>
      </label>

      <!-- Quantity -->
      <label class="block mb-4">
        <span class="text-gray-700">Quantity <span class="text-red-600">*</span></span>
        <input
          v-model.number="batch.quantity"
          :class="inputClass(errors.quantity)"
          @input="clearError('quantity')"
          type="number"
          min="1"
          required
        />
        <p v-if="errors.quantity" class="err">{{ errors.quantity }}</p>
      </label>

      <!-- Expiry Date -->
      <label class="block mb-4">
        <span class="text-gray-700">Expiry&nbsp;Date <span class="text-red-600">*</span></span>
        <input
          v-model="batch.expiry_date"
          :class="inputClass(errors.expiry_date)"
          @input="clearError('expiry_date')"
          type="date"
          required
        />
        <p v-if="errors.expiry_date" class="err">{{ errors.expiry_date }}</p>
      </label>

      <!-- Location / Notes -->
      <label class="block mb-4">
        <span class="text-gray-700">Location</span>
        <textarea v-model="batch.location" class="input"></textarea>
      </label>

      <label class="block mb-6">
        <span class="text-gray-700">Notes</span>
        <textarea v-model="batch.notes" class="input"></textarea>
      </label>

      <!-- Actions -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          :disabled="saving"
          class="btn-indigo"
          @click="handleSubmit(() => router.back())"
        >
          {{ saving ? 'Saving…' : 'Save & Go Back' }}
        </button>
        <button
          type="button"
          :disabled="saving"
          class="btn-green"
          @click="handleSubmit(() => router.push('/pharmacy/batches/new'))"
        >
          {{ saving ? 'Saving…' : 'Save & Add Another' }}
        </button>
        <button type="button" class="btn-gray" @click="router.back()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { BaseURL } from '@/main'

import CreateDrugForm from '@/components/pharmacy/CreateDrugForm.vue'
import type { Drug } from '@/types/Drug'
import type { DrugBatch } from '@/types/DrugBatch'

/* ── constants ── */
const NEW_DRUG_ID = 0

/* ── refs / state ── */
const router = useRouter()
const toast = useToast()
const drugs = ref<Drug[]>([])
const selectedDrugId = ref<number | ''>('')

const drugQuery = ref('')
const showDropdown = ref(false)
const comboRef = ref<HTMLElement | null>(null)

const batch = ref<Partial<DrugBatch>>({
  quantity: 1,
  expiry_date: ''
})

const saving = ref(false)
const errors = ref<Record<string, string>>({})

/* ── helpers ── */
const inputClass = (err?: string) =>
  [
    'mt-1 block w-full rounded border px-3 py-2',
    err ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
  ].join(' ')

const clearError = (k: string) => {
  delete errors.value[k]
}

const onQueryInput = () => {
  showDropdown.value = true // keep list visible
  selectedDrugId.value = '' // ⬅️ clear previous choice
}

/* ── combo-box logic ── */
const filteredDrugs = computed(() =>
  drugs.value.filter((d) => d.name.toLowerCase().includes(drugQuery.value.toLowerCase()))
)

const currentDrug = computed(() => drugs.value.find((d) => d.id === selectedDrugId.value) ?? null)

const selectDrug = (d: Drug) => {
  selectedDrugId.value = d.id
  drugQuery.value = `${d.name} (${d.unit})`
  showDropdown.value = false
}

const selectNewDrug = () => {
  selectedDrugId.value = NEW_DRUG_ID
  drugQuery.value = '+ Create new drug…'
  showDropdown.value = false
}

const onClickOutside = (e: MouseEvent) => {
  if (comboRef.value && !comboRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

/* ── fetch drugs ── */
onMounted(async () => {
  const { data } = await axios.get<Drug[]>(`${BaseURL}/pharmacy/drugs`)
  drugs.value = data
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => document.removeEventListener('click', onClickOutside))

/* ── new-drug callback ── */
const onDrugCreated = (d: Drug) => {
  drugs.value.push(d)
  selectedDrugId.value = d.id
  drugQuery.value = `${d.name} (${d.unit})`
}

/* ── validation ── */
const validate = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const e: Record<string, string> = {}

  if (!currentDrug.value && selectedDrugId.value !== NEW_DRUG_ID)
    e.drug = 'Please choose (or create) a drug.'
  if (!batch.value.batch_no) e.batch_no = 'Batch number is required.'
  if (!batch.value.quantity || batch.value.quantity < 1) e.quantity = 'Enter a positive quantity.'
  if (!batch.value.expiry_date) {
    e.expiry_date = 'Choose an expiry date.'
  } else {
    const picked = new Date(batch.value.expiry_date)
    if (picked <= today) e.expiry_date = 'Expiry date must be after today.'
  }
  errors.value = e
  return Object.keys(e).length === 0
}

/* ── submit ── */
const handleSubmit = async (onSuccess?: () => void) => {
  if (!validate()) return

  saving.value = true
  try {
    await axios.post(`${BaseURL}/pharmacy/batches`, {
      ...batch.value,
      drug_id: currentDrug.value!.id,
      expiry_date: new Date(batch.value.expiry_date!).toISOString()
    })
    toast.success('Batch saved')

    /* reset */
    batch.value = { quantity: 1, expiry_date: '' }
    selectedDrugId.value = ''
    drugQuery.value = ''
    onSuccess?.()
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.input {
  @apply mt-1 block w-full rounded border border-gray-300 px-3 py-2;
}
.err {
  @apply text-red-500 text-sm mt-1;
}
.btn-indigo {
  @apply bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-60;
}
.btn-green {
  @apply bg-green-600  hover:bg-green-700  text-white px-4 py-2 rounded disabled:opacity-60;
}
.btn-gray {
  @apply bg-gray-300  hover:bg-gray-400  text-black px-4 py-2 rounded;
}
</style>
