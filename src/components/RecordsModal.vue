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
    vid: {
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
  computed: {
    sortedVisits() {
      if (this.patientMeta && this.patientMeta.visits) {
        return Object.entries(this.patientMeta.visits)
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
    }
  },
  methods: {
    async getPatientMeta() {
      const toast = useToast()

      try {
        await axios.get(`${BaseURL}/patient-meta/${this.id}`).then((response) => {
          // Assuming the response data matches the structure of PatientMeta
          this.patientMeta = response.data as PatientMeta
        })
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
