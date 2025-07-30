import { createRouter, createWebHistory } from 'vue-router'
import PatientQueue from '../views/PatientQueue.vue'
import AllPatients from '../views/AllPatients.vue'
import SignIn from '../views/SignIn.vue'
import AddPatient from '../views/AddPatient.vue'
import SideBar from '../components/SideBar.vue'
import ViewEditPatient from '../views/ViewEditPatient.vue'
import PharmacyOverview from '@/views/PharmacyOverview.vue'
import CreateDrug from '@/views/CreateDrug.vue'
import CreateBatch from '@/views/CreateBatch.vue'
import DrugOverview from '@/views/DrugOverview.vue'
import { authUtils } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/signin'
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/patientqueue',
      name: 'patientqueue',
      component: PatientQueue
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
    },
    {
      path: '/patient/:id/:vid',
      name: 'patient',
      component: ViewEditPatient,
      props: true,
    },
    {
      path: '/pharmacy',
      name: 'PharmacyOverview',
      component: PharmacyOverview 
    },
    { path: '/pharmacy/drugs/new',  component: CreateDrug  },
    { path: '/pharmacy/batches/new', component: CreateBatch },
    {
      path: '/pharmacy/drugs/:drugId',
      name: 'DrugOverview',
      component: DrugOverview,
      props: true,
    },

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

router.beforeEach((to) => {
  const isAuthenticated = authUtils.isAuthenticated()

  if (!isAuthenticated && to.name !== 'signin') {
    return { name: 'signin' }
  } else if (isAuthenticated && to.name === 'signin') {
    return { name: 'allpatients' }
  }
})

export default router
