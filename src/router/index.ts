import { createRouter, createWebHistory } from 'vue-router'
import PatientQueue from '../views/PatientQueue.vue'
import AllPatients from '../views/AllPatients.vue'
import SignIn from '../views/SignIn.vue'
import AddPatient from '../views/AddPatient.vue'
import SideBar from '../components/SideBar.vue'
import ViewEditPatient from '../views/ViewEditPatient.vue'
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
      props: true
    }
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
