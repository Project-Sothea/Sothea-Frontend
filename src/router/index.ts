import { createRouter, createWebHistory } from 'vue-router'
import AllPatients from '../views/AllPatients.vue'
import SignIn from '../views/SignIn.vue'
import AddPatient from '../views/AddPatient.vue'
import SideBar from '../components/SideBar.vue'

import AdminModal from '../components/AdminModal.vue'
import PastMedHistModal from '../components/PastMedHistModal.vue'
import SocialHistModal from '../components/SocialHistModal.vue'
import VitalStatsModal from '../components/VitalStatsModal.vue'
import HeightWeightModal from '../components/HeightWeightModal.vue'
import VisualAcuityModal from '../components/VisualAcuityModal.vue'
import DrConsultModal from '../components/DrConsultModal.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/allpatients',
      name: 'allpatients',
      component: AllPatients
    },
    {
      path: '/addpatient',
      name: 'addpatient',
      component: AddPatient
    },
    {
      path: '/sidebar',
      name: 'sidebar',
      component: SideBar
    }
    // {
    //   path: '/admin',
    //   name: 'admin',
    //   component: AdminModal
    // },
    // {
    //   path: '/past-med-hist',
    //   name: 'past-med-hist',
    //   component: PastMedHistModal
    // },
    // {
    //   path: '/social-hist',
    //   name: 'social-hist',
    //   component: SocialHistModal
    // },
    // {
    //   path: '/vital-stats',
    //   name: 'vital-stats',
    //   component: VitalStatsModal
    // },
    // {
    //   path: '/height-weight',
    //   name: 'height-weight',
    //   component: HeightWeightModal
    // },
    // {
    //   path: '/visual-acuity',
    //   name: 'visual-acuity',
    //   component: VisualAcuityModal
    // },
    // {
    //   path: '/dr-consult',
    //   name: 'dr-consult',
    //   component: DrConsultModal
    // }
  ]
})

export default router
