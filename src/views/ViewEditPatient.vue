<template>
  <div>
    <NavBar />

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
          :regDate="patient?.admin.regDate"
          :queueNo="patient?.admin.queueNo"
          @openModal="openRecords"
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
    <RecordsModal :id="id" :isOpen="showRecords" @close="closeRecords"> </RecordsModal>

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
    <!-- Records Modal -->
    <RecordsModal :isOpen="showRecords" @close="closeRecords"> </RecordsModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

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
import DrConsultModal from '../components/DrConsultModal.vue'

import type Patient from '@/types/Patient'

import axios, { type AxiosResponse } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { BaseURL } from '@/main'
import AddNewVisitModal from '@/components/AddNewVisitModal.vue'

export default defineComponent({
  components: {
    SideBar,
    NavBar,
    SubNavBar,
    RecordsModal,
    AdminModal,
    PastMedHistModal,
    SocialHistModal,
    VitalStatsModal,
    HeightWeightModal,
    VisualAcuityModal,
    DrConsultModal,
    AddNewVisitModal
  },
  props: {
    id: {
      type: String,
      required: true
    },
    vid: {
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
      showRecords: false,
      tryDeleteVisit: false
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
        case 'add-new-visit':
          return 'AddNewVisitModal'
        default:
          return 'AdminModal'
      }
    }
  },
  methods: {
    setActiveSection(section: string) {
      // console.log(section)
      this.activeSection = section
    },

    async getPatientData(id: string, vid: string) {
      axios.get(`${BaseURL}/patient/${id}/${vid}`).then((response: AxiosResponse) => {
        // console.log(response)
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
        await this.getPatientData(this.id, this.vid)
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // console.log(error.response)
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
    },
    handlePatientVisitCreated(event: any) {
      const { id, name, age, vid } = event
      console.log(`Patient Created Wth ID: ${id}, Name: ${name}, Age: ${age}, VID: ${vid}`)
      this.$router.push('/patient/' + id + '/' + vid)
      this.setActiveSection('admin') // go back to admin modal
    },
    openRecords() {
      this.showRecords = true
    },
    closeRecords() {
      this.showRecords = false
    },
    handleDeleteVisit() {
      const toast = useToast()
      try {
        axios
          .delete(`${BaseURL}/patient/${this.id}/${this.vid}`)
          .then((response: AxiosResponse) => {
            // console.log(response)
            this.$router.push('/allpatients')
            toast.success('Patient Visit deleted successfully.')
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
  },
  created() {
    this.loadPatientData()
    this.$watch(
      () => this.$route.params.vid,
      (newId, oldId) => {
        this.loadPatientData()
      }
    )
  }
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
