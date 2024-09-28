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
          v-for="(regDate, visitId) in patientMeta.visits"
          :key="visitId"
          :id="id"
          :vid="visitId.toString()"
          :date="regDate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { Axios, AxiosError, type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { BaseURL } from '@/main'
import { defineComponent } from 'vue'
import RecordSection from './RecordSection.vue'
import type PatientMeta from '@/types/PatientMeta'
export default defineComponent({
  name: 'RecordsModal',
  components: {
    RecordSection
  },
  props: {
    id: {
      type: String,
      default: null
    },
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      patientMeta: {} as PatientMeta // Define an empty patientMeta object
    }
  },
  watch: {
    isOpen(newValue) {
      if (newValue === true) {
        this.getPatientMeta()
      }
    }
  },
  methods: {
    async getPatientMeta() {
      const toast = useToast()

      try {
        await axios.get(`${BaseURL}/patient-meta/${this.id}`).then((response) => {
          // Assuming the response data matches the structure of PatientMeta
          this.patientMeta = response.data as PatientMeta

          console.log(this.patientMeta) // You can log this to verify the structure
        })
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error.response)
          if (error.response) {
            toast.error(error.response.data.error)
          }
        } else {
          // No response received at all
          console.log(error)
          toast.error('An internal server error occurred.')
        }
      }
    }
  }
})
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
