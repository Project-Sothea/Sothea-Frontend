<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col rounded-lg w-3/4 max-h-fit border border-gray-300 p-10">
      <h1>New Visit Admin Details</h1>
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
                  type="text"
                  placeholder="Name"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                />
                <span class="absolute top-1/2 left-4 -translate-y-1/2">
                  <img src="@/assets/user.svg" width="20" height="20" />
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
                  type="text"
                  placeholder="Khmer Name"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                />
                <span class="absolute top-1/2 left-4 -translate-y-1/2">
                  <img src="@/assets/user.svg" width="20" height="20" />
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
                  type="date"
                  :max="maxDate"
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
                />
              </div>
            </div>

            <!-- Age Input -->
            <div class="ml-2 w-1/4">
              <label for="" class="mb-1 block text-sm font-medium text-dark"> Age</label>
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
                Gender <span class="req">*</span>
              </label>
              <div class="relative z-20">
                <select
                  v-model="gender"
                  class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-3 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                >
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
                <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                  <img src="@/assets/chevrondown.svg" height="20" width="20" />
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
                  type="tel"
                  placeholder="Contact No."
                  class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
                />
                <span class="absolute top-1/2 left-4 -translate-y-1/2">
                  <img src="@/assets/phone.svg" width="20" height="20" />
                </span>
              </div>
            </div>

            <!-- Date Registered Input -->
            <div class="ml-2 w-1/2">
              <label class="mb-1 block text-sm font-medium text-dark">
                Date Registered <span class="req">*</span>
              </label>
              <div class="relative z-20">
                <input
                  v-model="regDate"
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

              <div :class="['relative', 'bg-white']">
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
                        <img src="@/assets/camera.svg" height="20" width="20" />
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
            Queue Number <span class="req">*</span>
          </label>
          <div class="relative">
            <input
              v-model="queueNo"
              type="text"
              placeholder="Queue Number"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="@/assets/queueno.svg" width="20" height="20" />
            </span>
          </div>
        </div>
        <!-- Village Input -->
        <div class="w-1/3">
          <label class="mb-1 block text-sm font-medium text-dark">
            Village <span class="req">*</span>
          </label>
          <div class="relative">
            <input
              v-model="village"
              type="text"
              placeholder="Village"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="@/assets/house.svg" width="20" height="20" />
            </span>
          </div>
        </div>

        <!-- Family Group Input -->
        <div class="ml-2 w-1/3">
          <label class="mb-1 block text-sm font-medium text-dark">
            Family Group <span class="req">*</span>
          </label>
          <div class="relative">
            <input
              v-model="familyGroup"
              type="text"
              placeholder="Family Group"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="@/assets/users.svg" width="20" height="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Row 5 -->
      <div class="flex flex-row w-full mb-2">
        <!-- Pregnant Input -->
        <div class="w-1/2">
          <label for="" class="mb-1 block text-sm font-medium text-dark">
            Pregnant? <span class="req">*</span>
          </label>
          <div class="relative z-20">
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="@/assets/pregnantwoman.svg" width="25" height="25" />
            </span>
            <select
              v-model="pregnant"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="true">Y</option>
              <option :value="false">N</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>

        <!-- Last Menstrual Period -->
        <div class="ml-2 w-1/2">
          <label class="mb-1 block text-sm font-medium text-dark"> Last Menstrual Period </label>
          <div class="relative z-20">
            <input
              v-model="lastMenstrualPeriod"
              :disabled="isMale"
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
              type="text"
              placeholder="Enter Drug Allergies"
              class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            />
            <span class="absolute top-1/2 left-4 -translate-y-1/2">
              <img src="@/assets/drug.svg" width="20" height="20" />
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
              <img src="@/assets/mask.svg" width="25" height="25" />
            </span>
            <select
              v-model="sentToId"
              class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-200"
            >
              <option :value="true">Y</option>
              <option :value="false">N</option>
            </select>
            <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
              <img src="@/assets/chevrondown.svg" height="20" width="20" />
            </span>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex flex-row-reverse w-full mt-5">
        <button
          @click="submitData"
          class="px-5 py-2 transition ease-in duration-200 rounded-lg text-sm text-[#3f51b5] hover:bg-[#3f51b5] hover:text-white border-2 border-[#3f51b5] focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import type Admin from '@features/auth/types/Admin'
import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import type Patient from '../../types/Patient'
import { addVisit } from '@features/patient-record/api/visit'
import { handleApiError } from '@shared/api/handleApiError'

const props = defineProps<{
  patientId?: string
  patientVid?: string
  patientData?: Patient
}>()

const emit = defineEmits<{
  patientVisitCreated: [{ id: string; name: string; age: number; vid: string }]
}>()

const toast = useToast()

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
const photo = ref<string | null>('')
const selectedPhoto = ref('')
const sentToId = ref<boolean | null>(null)

const isMale = ref(false)
const maxDate = ref(formatDateForInput(new Date().toISOString()))

watch(gender, (newValue) => {
  isMale.value = newValue === 'M'
})

const ageComputed = computed(() => {
  if (dob.value) return new Date().getFullYear() - new Date(dob.value).getFullYear()
  return null
})

onMounted(() => {
  if (props.patientData) {
    const admin = props.patientData.admin
    if (!admin) return

    name.value = admin.name
    khmerName.value = admin.khmerName
    dob.value = admin.dob ? formatDateForInput(admin.dob) : null
    age.value = admin.age
    gender.value = admin.gender
    contactNo.value = admin.contactNo
    regDate.value = formatDateForInput(new Date().toISOString())
    queueNo.value = admin.queueNo
    village.value = admin.village
    familyGroup.value = admin.familyGroup
    drugAllergies.value = admin.drugAllergies
    photo.value = admin.photo ? atob(admin.photo) : null
    selectedPhoto.value = photo.value ? `data:image/png;base64,${photo.value}` : ''
  }
})

// POST request to add a new patient / PUT request to update an existing patient
// If isAdd is true, do insert patient, otherwise do update patient
async function submitData() {
  if (!name.value) return toast.error('Name is required')
  if (!khmerName.value) return toast.error('Khmer Name is required')
  if (!dob.value) return toast.error('Date of Birth is required')
  if (!gender.value) return toast.error('Gender is required')
  if (!contactNo.value) return toast.error('Contact No. is required')
  if (!regDate.value) return toast.error('Date Registered is required')
  if (!queueNo.value) return toast.error('Queue Number is required')
  if (!village.value) return toast.error('Village is required')
  if (familyGroup.value === '') return toast.error('Family Group is required')
  if (pregnant.value == null) return toast.error('Pregnant? is required')
  if (sentToId.value == null) return toast.error('Sent to Infectious Disease? is required')
  if (ageComputed.value == null) return toast.error('Please enter a valid Date of Birth')

  const admin: Admin = {
    name: name.value,
    khmerName: khmerName.value,
    dob: new Date(dob.value!).toISOString(),
    age: ageComputed.value!,
    gender: gender.value,
    contactNo: contactNo.value,
    regDate: new Date(regDate.value!).toISOString(),
    queueNo: queueNo.value,
    village: village.value,
    familyGroup: familyGroup.value,
    pregnant: pregnant.value,
    lastMenstrualPeriod: lastMenstrualPeriod.value
      ? new Date(lastMenstrualPeriod.value).toISOString()
      : null,
    drugAllergies: drugAllergies.value || null,
    photo: photo.value,
    sentToId: sentToId.value
  }

  try {
    // Add new patient visit
    const response = await addVisit(props.patientId!, admin as any)
    toast.success('New Patient Visit created successfully!')
    // Emit patient details to be rendered in sidebar
    emit('patientVisitCreated', {
      id: props.patientId ?? '',
      name: name.value,
      age: ageComputed.value,
      vid: response.data['vid']
    })
  } catch (error) {
    console.error(error)
    toast.error(handleApiError(error))
  }
}

// handleFileChange(event: any) {
//   const file = event.target.files[0]
//   if (file && /\.(jpg|jpeg|png)$/i.test(file.name)) {
//     const reader = new FileReader()
//     reader.onload = (e) => {
//       // Remove the data URL prefix to get just the base64 string
//       if (e.target != null && typeof e.target.result == 'string') {
//         this.selectedPhoto = e.target.result
//         this.photo = e.target.result.split(',')[1]
//       }
//     }
//     reader.readAsDataURL(file)
//     console.log(this.selectedPhoto)
//     console.log(this.photo)
//   } else {
//     // Reset selectedPhoto or show error message
//     this.selectedPhoto = ''
//     alert('Please select a JPEG, JPG, or PNG file.')
//   }
// },
async function handleImageUpload(event: any) {
  const imageFile = event.target.files[0]
  console.log('originalFile instanceof Blob', imageFile instanceof Blob) // true
  console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)
  toast.default('Loading Image...')

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
