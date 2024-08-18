<template>
  <div>
    <NavBar />

    <div class="flex">
      <SideBar :activeSection="activeSection" :id="id" :name="name" :age="age ? age : undefined"
        @update:activeSection="setActiveSection" />
      <div class="content flex-grow p-6">
        <keep-alive>
          <component :is="activeComponent" :patientId="id" :patientData="patient" :isAdd="false"
            @reload="loadPatientData" @patientUpdated="handlePatientUpdated">
          </component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import SideBar from '../components/SideBar.vue'
import NavBar from '../components/NavBar.vue'

import AdminModal from '../components/AdminModal.vue'
import PastMedHistModal from '../components/PastMedHistModal.vue'
import SocialHistModal from '../components/SocialHistModal.vue'
import VitalStatsModal from '../components/VitalStatsModal.vue'
import HeightWeightModal from '../components/HeightWeightModal.vue'
import VisualAcuityModal from '../components/VisualAcuityModal.vue'
import DrConsultModal from '../components/DrConsultModal.vue'

import type Patient from '@/types/Patient'

import axios, { type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { BaseURL } from '@/main';

export default defineComponent({
  components: {
    SideBar,
    NavBar,
    AdminModal,
    PastMedHistModal,
    SocialHistModal,
    VitalStatsModal,
    HeightWeightModal,
    VisualAcuityModal,
    DrConsultModal
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeSection: 'admin',
      patient: null as Patient | null,
      name: '' as string,
      age: 0 as number | null,
    }
  },
  computed: {
    activeComponent() {
      switch (this.activeSection) {
        case 'admin':
          return 'AdminModal'
        case 'past-med-hist':
          return 'PastMedHistModal'
        case 'social-hist':
          return 'SocialHistModal'
        case 'vital-stats':
          return 'VitalStatsModal'
        case 'height-weight':
          return 'HeightWeightModal'
        case 'visual-acuity':
          return 'VisualAcuityModal'
        case 'dr-consult':
          return 'DrConsultModal'
        default:
          return 'AdminModal'
      }
    }
  },
  methods: {
    setActiveSection(section: string) {
      console.log(section)
      this.activeSection = section
    },

    async getPatientData(id: string) {
      axios.get(`${BaseURL}/patient/${id}`)
        .then((response: AxiosResponse) => {
          console.log(response)
          const { data } = response
          this.patient = JSON.parse(JSON.stringify(data)) as Patient
          this.age = this.patient.admin.dob 
            ? new Date().getFullYear() - new Date(this.patient.admin.dob).getFullYear()
            : null
          this.name = this.patient.admin.name
        })
    },
    async loadPatientData() {
      const toast = useToast()
      try {
        await this.getPatientData(this.id);
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
    },
    handlePatientUpdated(event: any) {
      const { id, name, age } = event
      console.log(`Patient Updated With ID: ${id}, Name: ${name}, Age: ${age}`)
      this.name = name
      this.age = age
    }
  },
  created() {
    this.loadPatientData()
  },
})
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
