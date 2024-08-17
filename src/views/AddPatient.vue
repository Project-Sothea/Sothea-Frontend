<template>
  <NavBar />
  <div class="flex">
    <SideBar
      :activeSection="activeSection"
      @update:activeSection="setActiveSection"
      :id="undefined"
      :name="undefined"
      :age="undefined"
    />
    <div class="main-content flex-grow">
      <SubNavBar @openModal="openRecords" />

      <div class="content p-6">
        <keep-alive>
          <component
            :is="activeComponent"
            :patientId="patientId"
            @patientCreated="handlePatientCreated"
          ></component>
        </keep-alive>
      </div>
    </div>

    <!-- Records Modal -->
    <RecordsModal :isOpen="showRecords" @close="closeRecords"> </RecordsModal>
  </div>
</template>

<script lang="ts">
import NavBar from '../components/NavBar.vue'
import SideBar from '../components/SideBar.vue'
import SubNavBar from '../components/SubNavBar.vue'
import RecordsModal from '../components/RecordsModal.vue'

import AdminModal from '../components/AdminModal.vue'
import PastMedHistModal from '../components/PastMedHistModal.vue'
import SocialHistModal from '../components/SocialHistModal.vue'
import VitalStatsModal from '../components/VitalStatsModal.vue'
import HeightWeightModal from '../components/HeightWeightModal.vue'
import VisualAcuityModal from '../components/VisualAcuityModal.vue'
import DrConsultModal from '../components/DrConsultModal.vue'

import axios from 'axios'

export default {
  components: {
    NavBar,
    SideBar,
    SubNavBar,
    RecordsModal,
    AdminModal,
    PastMedHistModal,
    SocialHistModal,
    VitalStatsModal,
    HeightWeightModal,
    VisualAcuityModal,
    DrConsultModal
  },
  data() {
    return {
      activeSection: 'admin',
      patientId: '', // Empty value passed to the Sidebar since it is not needed
      name: '' as string, // Empty value passed to the Sidebar since it is not needed
      age: null, // Empty value passed to the Sidebar since it is not needed
      showRecords: false
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
  created() {
    this.getIsValidToken()
  },
  methods: {
    setActiveSection(section: string) {
      this.activeSection = section
    },
    async getIsValidToken() {
      await axios.get('/login/is-valid-token')
    },
    handlePatientCreated(event: any) {
      const { id, name, age } = event
      console.log(`Patient Created Wth ID: ${id}, Name: ${name}, Age: ${age}`)
      this.$router.push('/patient/' + id)
    },
    openRecords() {
      this.showRecords = true
    },
    closeRecords() {
      this.showRecords = false
    }
  }
}
</script>
