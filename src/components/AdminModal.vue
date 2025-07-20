<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>Admin Details</h1>
      <br />
      <div class="flex flex-row w-full">
        <div class="flex flex-col">
          <!-- Row 1 -->
          <div class="flex flex-row mb-2">
            <!-- Name Input -->
            <div class="w-1/2">
              <label class="mb-1 block text-sm font-medium text-dark">
                Name <span class="req">*</span></label
              >
              <div class="relative">
                <input
                  v-model="name"
                  :disabled="!isEditing && !isAdd"
                  type="text"
                  placeholder="Name"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                />
                <span class="absolute top-1/2 left-4 -translate-y-1/2">
                  <img src="../assets/user.svg" width="20" height="20" />
                </span>
              </div>
            </div>

            <!-- Khmer Name Input -->
            <div class="ml-2 w-1/2">
              <label class="mb-1 block text-sm font-medium text-dark">
                Khmer Name <span class="req">*</span></label
              >
              <div class="relative">
                <input
                  v-model="khmerName"
                  :disabled="!isEditing && !isAdd"
                  type="text"
                  placeholder="Khmer Name"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                />
                <span class="absolute top-1/2 left-4 -translate-y-1/2">
                  <img src="../assets/user.svg" width="20" height="20" />
                </span>
              </div>
            </div>
          </div>
          <!-- Row 2 -->
          <div class="flex flex-row w-full">
            <!-- DOB Input -->
            <div class="w-1/2">
              <label class="mb-1 block text-sm font-medium text-dark"> DOB </label>
              <div class="relative z-20">
                <input
                  v-model="dob"
                  :disabled="!isEditing && !isAdd"
                  type="date"
                  :max="maxDate"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
                />
              </div>
            </div>

            <!-- Age Input -->
            <div class="ml-2 w-1/4">
              <label for="" class="mb-1 block text-sm font-medium text-dark"> Age </label>
              <input
                :value="ageComputed"
                disabled
                type="number"
                placeholder=""
                min="0"
                step="1"
                class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
              />
            </div>

            <!-- Gender Input -->
            <div class="ml-2 w-1/4">
              <label for="" class="mb-1 block text-sm font-medium text-dark">
                Gender <span class="req">*</span></label
              >
              <div class="relative z-20">
                <select
                  v-model="gender"
                  :disabled="!isEditing && !isAdd"
                  class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-3 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                >
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
                <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <img src="../assets/chevrondown.svg" height="20" width="20" />
                </span>
              </div>
            </div>
          </div>

          <!-- Row 3 -->
          <div class="flex flex-row w-full mb-2">
            <!-- Contact No. Input -->
            <div class="w-1/2">
              <label class="mb-1 block text-sm font-medium text-dark">
                Contact No. <span class="req">*</span></label
              >
              <div class="relative">
                <input
                  v-model="contactNo"
                  :disabled="!isEditing && !isAdd"
                  type="tel"
                  placeholder="Contact No."
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                />
                <span class="absolute top-1/2 left-4 -translate-y-1/2">
                  <img src="../assets/phone.svg" width="20" height="20" />
                </span>
              </div>
            </div>

            <!-- Date Registered Input -->
            <div class="ml-2 w-1/2">
              <label class="mb-1 block text-sm font-medium text-dark">
                Date Registered <span class="req">*</span></label
              >
              <div class="relative z-20">
                <input
                  v-model="regDate"
                  :disabled="!isEditing && !isAdd"
                  type="date"
                  :max="maxDate"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Photo Input -->

        <div class="flex flex-row w-1/2 ml-2">
          <div class="flex flex-col w-full">
            <div class="w-full">
              <label class="mb-1 block text-sm font-medium text-dark"> Photo ID </label>

              <div
                :class="[
                  'relative',
                  { 'bg-gray-200': !isEditing && !isAdd, 'bg-white': isEditing || isAdd }
                ]"
              >
                <label
                  for="file"
                  class="flex w-full h-[11rem] justify-center items-center cursor-pointer rounded-md border border-dashed border-gray-300 p-3 mr-2"
                >
                  <div>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      class="sr-only"
                      :disabled="!isEditing && !isAdd"
                      @change="handleImageUpload"
                      accept=".jpg, .jpeg, .png, .heic"
                    />
                    <img
                      v-if="selectedPhoto"
                      :src="selectedPhoto"
                      alt="Selected Image"
                      class="object-cover rounded-lg w-52 h-40"
                    />
                    <template v-else>
                      <span class="flex items-center justify-center">
                        <img src="../assets/camera.svg" height="20" width="20" />
                      </span>
                      <span class="text-sm text-body-color"> Add Photo ID </span>
                    </template>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Row 4 -->
      <div class="flex flex-row w-full mb-2">
        <!-- Queue No Input -->
        <div class="mr-2 w-1/3">
          <label class="mb-1 block text-sm font-medium text-dark">
            Queue Number <span class="req">*</span></label
          >
          <div class="relative">
            <input
              v-model="queueNo"
              :disabled="!isEditing && !isAdd"
              type="text"
              placeholder="Queue Number"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="../assets/queueno.svg" width="20" height="20" />
            </span>
          </div>
        </div>
        <!-- Village Input -->
        <div class="w-1/3">
          <label class="mb-1 block text-sm font-medium text-dark">
            Village <span class="req">*</span></label
          >
          <div class="relative z-20">
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="../assets/house.svg" width="20" height="20" />
            </span>

            <select
              v-model="village"
              :disabled="!isEditing && !isAdd"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option value="SO">SO</option>
              <option value="R1">R1</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="../assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>

        <!-- Family Group Input -->
        <div class="ml-2 w-1/3">
          <label class="mb-1 block text-sm font-medium text-dark">
            Family Group <span class="req">*</span></label
          >
          <div class="relative">
            <input
              v-model="familyGroup"
              :disabled="!isEditing && !isAdd"
              type="text"
              placeholder="Family Group"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="../assets/users.svg" width="20" height="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Row 5 -->
      <div class="flex flex-row w-full mb-2">
        <!-- Pregnant Input -->
        <div class="w-1/2">
          <label for="" class="mb-1 block text-sm font-medium text-dark">
            Pregnant? <span class="req">*</span></label
          >
          <div class="relative z-20">
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="../assets/pregnantwoman.svg" width="25" height="25" />
            </span>
            <select
              v-model="pregnant"
              :disabled="!isEditing && !isAdd"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="true">Y</option>
              <option :value="false">N</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="../assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>

        <!-- Last Menstrual Period -->
        <div class="ml-2 w-1/2">
          <label class="mb-1 block text-sm font-medium text-dark"> Last Menstrual Period </label>
          <div class="relative z-20">
            <input
              v-model="lastMenstrualPeriod"
              :disabled="(!isEditing && !isAdd) || isMale"
              type="date"
              :max="maxDate"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
            />
          </div>
        </div>
      </div>

      <!-- Row 6 -->
      <div class="flex flex-row w-full">
        <!-- Drug Allergies Input -->
        <div class="w-1/2">
          <label class="mb-1 block text-sm font-medium text-dark"> Drug Allergies </label>
          <div class="relative">
            <input
              v-model="drugAllergies"
              :disabled="!isEditing && !isAdd"
              type="text"
              placeholder="Enter Drug Allergies"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="../assets/drug.svg" width="20" height="20" />
            </span>
          </div>
        </div>

        <!-- Infectious Disease Input -->
        <div class="w-1/2 ml-2">
          <label for="" class="mb-1 block text-sm font-medium text-dark">
            Sent to Infectious Disease? <span class="req">*</span>
          </label>
          <div class="relative z-20">
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="../assets/mask.svg" width="25" height="25" />
            </span>
            <select
              v-model="sentToId"
              :disabled="!isEditing && !isAdd"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="true">Y</option>
              <option :value="false">N</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="../assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isAdd"
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save
        </button>
      </div>
      <!-- Edit Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="!isEditing && !isAdd"
          @click="toggleEdit"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Edit
        </button>
      </div>
      <!-- Save Edits Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          v-if="isEditing && !isAdd"
          @click="saveChanges"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save Edits
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'

import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '@/types/Patient'
import { BaseURL } from '@/main'

const props = defineProps<{
  patientId?: string
  patientData?: Patient
  isAdd?: boolean
  patientVid?: string
}>()

const emit = defineEmits<{
  patientCreated: [
    {
      id: string
      name: string
      age: number | null
      vid: number
      regDate: string | null
      queueNo: string | null
    }
  ]
  patientUpdated: [
    {
      id: string | undefined
      name: string
      age: number
      vid: string | undefined
      regDate: string | null
      queueNo: string | null
    }
  ]
}>()

const name = ref('')
const khmerName = ref('')
const dob = ref<string | null>('')
const age = ref<number | null>(0)
const gender = ref<'M' | 'F' | ''>('')
const contactNo = ref('')
const regDate = ref('')
const queueNo = ref('')
const village = ref('')
const familyGroup = ref('')
const pregnant = ref<boolean | null>(null)
const lastMenstrualPeriod = ref<string | null>(null)
const drugAllergies = ref<string | null>('')
const selectedPhoto = ref('')
const photo = ref<string | null>('')
const sentToId = ref<boolean | null>(null)
const isEditing = ref(false)
const isMale = ref(false)
const maxDate = ref(formatDateForInput(new Date().toISOString()))

const toast = useToast()

const ageComputed = computed(() => {
  return dob.value ? new Date().getFullYear() - new Date(dob.value).getFullYear() : null
})

watch(
  () => props.patientData,
  (newVal) => {
    if (!props.isAdd && newVal) {
      const admin = newVal.admin
      if (!admin) return
      name.value = admin.name
      khmerName.value = admin.khmerName
      dob.value = admin.dob != null ? formatDateForInput(admin.dob) : null
      age.value = admin.age
      gender.value = admin.gender
      contactNo.value = admin.contactNo
      regDate.value = formatDateForInput(admin.regDate)
      queueNo.value = admin.queueNo
      village.value = admin.village
      familyGroup.value = admin.familyGroup
      pregnant.value = admin.pregnant
      lastMenstrualPeriod.value = admin.lastMenstrualPeriod
        ? formatDateForInput(admin.lastMenstrualPeriod)
        : null
      drugAllergies.value = admin.drugAllergies
      photo.value = admin.photo ? atob(admin.photo) : null
      sentToId.value = admin.sentToId
      selectedPhoto.value = photo.value ? `data:image/png;base64,${photo.value}` : ''
    }
  }
)

watch(gender, (newValue) => {
  isMale.value = newValue === 'M'
})

// POST request to add a new patient / PUT request to update an existing patient
// If isAdd is true, do insert patient, otherwise do update patient
async function submitData() {
  try {
    // Perform validation checks
    if (!name.value) {
      toast.error('Name is required')
      return
    }
    if (!khmerName.value) {
      toast.error('Khmer Name is required')
      return
    }
    if (!dob.value) {
      toast.error('Date of Birth is required')
      return
    }
    if (!gender.value) {
      toast.error('Gender is required')
      return
    }
    if (!contactNo.value) {
      toast.error('Contact No. is required')
      return
    }
    if (!regDate.value) {
      toast.error('Date Registered is required')
      return
    }
    if (!queueNo.value) {
      toast.error('Queue Number is required')
      return
    }
    if (!village.value) {
      toast.error('Village is required')
      return
    }
    if (familyGroup.value == '') {
      toast.error('Family Group is required')
      return
    }
    if (pregnant.value == null) {
      toast.error('Pregnant? is required')
      return
    }
    if (sentToId.value == null) {
      toast.error('Sent to Infectious Disease? is required')
      return
    }
    if (ageComputed.value == null) {
      toast.error('Please enter a valid Date of Birth')
      return
    }

    const admin = {
      familyGroup: familyGroup.value,
      regDate: new Date(regDate.value).toISOString(), // Convert back to UTC timezone to store in DB
      queueNo: queueNo.value || null,
      name: name.value,
      khmerName: khmerName.value,
      dob: new Date(dob.value).toISOString(), // Convert back to UTC timezone to store in DB
      age: ageComputed.value,
      gender: gender.value,
      village: village.value,
      contactNo: contactNo.value,
      pregnant: pregnant.value,
      lastMenstrualPeriod: lastMenstrualPeriod.value
        ? new Date(lastMenstrualPeriod.value).toISOString() // Convert back to UTC timezone to store in DB
        : null,
      drugAllergies: drugAllergies.value || null,
      sentToId: sentToId.value,
      photo: photo.value || null // sending over as decoded base64 string, encoded in the backend
    }

    if (props.isAdd && !isEditing.value) {
      // Add new patient
      const response = await axios.post(`${BaseURL}/patient`, admin)
      toast.success('New Patient created successfully!')
      // Emit patient details to be rendered in sidebar
      emit('patientCreated', {
        id: response.data['id'],
        name: name.value,
        age: ageComputed.value,
        vid: 1, // newly created patient will always have a visit id of 1
        regDate: regDate.value, // regDate in local timezone
        queueNo: queueNo.value
      })
    } else if (!props.isAdd && isEditing.value) {
      // Editing an existing patient
      await axios.patch(`${BaseURL}/patient/${props.patientId}/${props.patientVid}`, {
        admin: admin
      })
      toast.success('Admin Details updated successfully!')
      // Emit updated patient details to be rendered in sidebar
      emit('patientUpdated', {
        id: props.patientId,
        name: name.value,
        age: ageComputed.value,
        vid: props.patientVid,
        regDate: regDate.value, // regDate in local timezone
        queueNo: queueNo.value
      })
    }
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

async function handleImageUpload(event: any) {
  const imageFile = event.target.files[0]
  console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  try {
    let fileToProcess = imageFile
    // Check if the file is a .heic image
    if (fileToProcess.type === 'image/heic') {
      try {
        // Convert HEIC to JPEG
        const convertedBlob = await heic2any({
          blob: fileToProcess,
          toType: 'image/jpeg'
        })
        fileToProcess = convertedBlob as Blob
      } catch (heicError) {
        console.error('HEIC conversion failed', heicError)
        toast.error('Image upload failed, Please re-upload a JPEG, JPG, PNG or HEIC file.')
        return
      }
    }

    const compressedFile = await imageCompression(fileToProcess, options)
    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob) // true
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`) // smaller than maxSizeMB
    const reader = new FileReader()
    reader.onload = (e) => {
      // Remove the data URL prefix to get just the base64 string
      if (e.target != null && typeof e.target.result == 'string') {
        selectedPhoto.value = e.target.result
        photo.value = e.target.result.split(',')[1]
      }
    }
    reader.readAsDataURL(compressedFile)
  } catch (error) {
    console.log(error)
    selectedPhoto.value = ''
    alert('Please select a JPEG, JPG, PNG or HEIC file.')
  }
}

function formatDateForInput(dateString: string) {
  const date = new Date(dateString)

  // Get the date components (year, month, day) of date in local timezone
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Return the formatted date string
  return `${year}-${month}-${day}`
}

function toggleEdit() {
  // console.log('toggleEdit')
  isEditing.value = !isEditing.value
  // console.log(this.isEditing)
}

function saveChanges() {
  // console.log('saving changes....')
  submitData()
  toggleEdit()
}
</script>

<style scoped>
h1 {
  font-size: 1.25rem;
  font-weight: 500;
}
.req {
  color: red;
}
</style>
