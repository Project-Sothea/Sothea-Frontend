<template>
  <!-- Overlay -->
  <div v-if="isOpen" class="overlay"></div>

  <!-- Records Modal -->
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h1>Records</h1>
      <button @click="$emit('close')" class="close-btn">×</button>
      <div class="pt-2 pl-2">
        <RecordSection
          v-for="visit in sortedVisits"
          :key="visit.visitId"
          :id="id"
          :vid="visit.visitId"
          :currVisit="visit.visitId === vid"
          :date="visit.regDate"
          @close="$emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { fetchPatientMeta } from '@features/patient-record/api/record'
import RecordSection from './RecordSection.vue'
import type PatientMeta from '../../types/PatientMeta'

const props = defineProps<{
  id: string
  vid: string
  isOpen: boolean
}>()

defineEmits<{
  close: [void]
}>()

const toast = useToast()

const patientMeta = ref<PatientMeta | null>(null)

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      await getPatientMeta()
    }
  }
)

// Computed: sortedVisits
const sortedVisits = computed(() => {
  if (patientMeta.value && patientMeta.value.visits) {
    return Object.entries(patientMeta.value.visits)
      .sort(([, regDateA], [, regDateB]) => {
        const dateA = new Date(regDateA as string)
        const dateB = new Date(regDateB as string)
        return dateB.getTime() - dateA.getTime()
      })
      .map(([visitId, regDate]) => ({
        regDate: regDate as string,
        visitId: visitId.toString()
      }))
  }
  return []
})

async function getPatientMeta() {
  try {
    patientMeta.value = await fetchPatientMeta(props.id)
  } catch (error) {
    console.error(error)
    toast.error('Failed to load patient record metadata')
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.modal-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}

h1 {
  font-size: 1.25rem;
  font-weight: 500;
  margin-left: 10px;
}
</style>
