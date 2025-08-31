import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PatientQueue from '@features/patient-queue/pages/PatientQueue.vue'
import PatientDirectory from '@features/patient-directory/pages/PatientDirectory.vue'
import SignIn from '@features/auth/pages/SignIn.vue'
import PatientRecordPage from '@features/patient-record/pages/PatientRecordPage.vue'
import PharmacyOverview from '@features/pharmacy/pages/PharmacyOverview.vue'
import CreateDrug from '@features/pharmacy/pages/CreateDrug.vue'
import CreateBatch from '@features/pharmacy/pages/CreateBatch.vue'
import DrugOverview from '@features/pharmacy/pages/DrugOverview.vue'
import { useAuth } from '@features/auth/composables/useAuth'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/sign-in' },
  { path: '/sign-in', name: 'sign-in', component: SignIn },

  // Patient queue
  { path: '/patient-queue', name: 'patient-queue', component: PatientQueue },

  // Patient directory
  { path: '/patient-directory', name: 'patient-directory', component: PatientDirectory },

  // Patient record
  { path: '/patient/new', name: 'patient-new', component: PatientRecordPage },
  { path: '/patient/:id/:vid', name: 'patient-record', component: PatientRecordPage, props: true },

  // Pharmacy
  { path: '/pharmacy', name: 'pharmacy-overview', component: PharmacyOverview },
  { path: '/pharmacy/drugs/new', name: 'drug-new', component: CreateDrug },
  { path: '/pharmacy/batches/new', name: 'batch-new', component: CreateBatch },
  { path: '/pharmacy/drugs/:drugId', name: 'drug-overview', component: DrugOverview, props: true }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated.value && to.name !== 'sign-in') {
    return { name: 'sign-in' }
  }
  if (isAuthenticated.value && to.name === 'sign-in') {
    return { name: 'patient-directory' }
  }
})

export default router
