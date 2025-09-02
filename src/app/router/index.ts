import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import SignIn from '@features/auth/pages/SignInPage.vue'
import PatientQueue from '@features/patient-queue/pages/PatientQueuePage.vue'
import PatientDirectory from '@features/patient-directory/pages/PatientDirectoryPage.vue'
import PatientRecord from '@features/patient-record/pages/PatientRecordPage.vue'
import PharmacyOverview from '@features/pharmacy/pages/PharmacyOverviewPage.vue'
import PharmacyCreateBatch from '@features/pharmacy/pages/PharmacyCreateBatchPage.vue'
import PharmacyDrugOverview from '@features/pharmacy/pages/PharmacyDrugOverviewPage.vue'
import { useAuth } from '@features/auth/composables/useAuth'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/sign-in' },
  { path: '/sign-in', name: 'sign-in', component: SignIn },

  // Patient queue
  { path: '/patient-queue', name: 'patient-queue', component: PatientQueue },

  // Patient directory
  { path: '/patient-directory', name: 'patient-directory', component: PatientDirectory },

  // Patient record
  { path: '/patient/new', name: 'patient-new', component: PatientRecord },
  { path: '/patient/:id/:vid', name: 'patient-record', component: PatientRecord, props: true },

  // Pharmacy
  { path: '/pharmacy', name: 'pharmacy-overview', component: PharmacyOverview },
  { path: '/pharmacy/batches/new', name: 'batch-new', component: PharmacyCreateBatch },
  {
    path: '/pharmacy/drugs/:drugId',
    name: 'drug-overview',
    component: PharmacyDrugOverview,
    props: true
  }
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
