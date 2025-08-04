<template>
  <NavBar />
  <!-- <SideBar /> -->

  <div class="flex">
    <SideBar
      :activeSection="activeSection"
      @update:activeSection="setActiveSection"
      :id="undefined"
      :name="undefined"
      :age="undefined"
      :isAdd="true"
    />
    <div class="content flex-grow p-6">
      <keep-alive>
        <component
          :is="activeComponent"
          :isAdd="true"
          :patientId="String(patientId)"
          :patientVid="String(patientVid)"
          @patientCreated="handlePatientCreated"
        ></component>
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import NavBar from '../components/NavBar.vue'
import SideBar from '../components/SideBar.vue'

import AdminModal from '../components/AdminModal.vue'
import PastMedHistModal from '../components/PastMedHistModal.vue'
import SocialHistModal from '../components/SocialHistModal.vue'
import VitalStatsModal from '../components/VitalStatsModal.vue'
import HeightWeightModal from '../components/HeightWeightModal.vue'
import VisualAcuityModal from '../components/VisualAcuityModal.vue'
import FallRiskModal from '@/components/FallRiskModal.vue'
import DentalModal from '@/components/DentalModal.vue'
import DrConsultModal from '../components/DrConsultModal.vue'
import PhysiotherapyModal from '../components/PhysiotherapyModal.vue'
import PrescriptionModal from '@/components/PrescriptionModal.vue'

const router = useRouter()

const activeSection = ref('admin')
const patientId = ref('')
const patientVid = ref('')

const activeComponent = computed(() => {
  const map: Record<string, any> = {
    admin: AdminModal,
    'past-med-hist': PastMedHistModal,
    'social-hist': SocialHistModal,
    'vital-stats': VitalStatsModal,
    'height-weight': HeightWeightModal,
    'visual-acuity': VisualAcuityModal,
    'fall-risk': FallRiskModal,
    dental: DentalModal,
    'dr-consult': DrConsultModal,
    physiotherapy: PhysiotherapyModal,
    prescription: PrescriptionModal
  }
  return map[activeSection.value] || AdminModal
})

function setActiveSection(section: string) {
  activeSection.value = section
}

function handlePatientCreated(event: any) {
  const { id, name, age, vid } = event
  console.log(`Patient Created Wth ID: ${id}, Name: ${name}, Age: ${age}, VID: ${vid}`)
  router.push('/patient/' + id + '/' + vid)
}
</script>
