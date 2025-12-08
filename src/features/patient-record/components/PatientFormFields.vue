<template>
  <div>
    <div class="flex flex-row w-full">
      <div class="flex flex-col flex-1">
        <!-- Row 1 -->
        <div class="flex flex-row mb-2">
          <!-- Name -->
          <div class="w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Name <span class="req">*</span></label
            >
            <div class="relative">
              <input
                v-model="name"
                :disabled="disabled"
                type="text"
                placeholder="Name"
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
              />
              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/user.svg" width="20" height="20" />
              </span>
            </div>
          </div>
          <!-- Khmer Name -->
          <div class="ml-2 w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Khmer Name <span class="req">*</span></label
            >
            <div class="relative">
              <input
                v-model="khmerName"
                :disabled="disabled"
                type="text"
                placeholder="Khmer Name"
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
              />
              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/user.svg" width="20" height="20" />
              </span>
            </div>
          </div>
        </div>
        <!-- Row 2 -->
        <div class="flex flex-row w-full">
          <div class="w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark">DOB</label>
            <div class="relative z-20">
              <input
                v-model="dob"
                :disabled="disabled"
                type="date"
                :max="maxDate"
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              />
            </div>
          </div>
          <div class="ml-2 w-1/4">
            <label class="mb-1 block text-sm font-medium text-dark">Age</label>
            <input
              :value="form.ageComputed.value"
              readonly
              type="number"
              class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-sm text-dark-6 outline-none disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2"
            />
          </div>
          <div class="ml-2 w-1/4">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Gender <span class="req">*</span></label
            >
            <div class="relative z-20">
              <select
                v-model="gender"
                :disabled="disabled"
                class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-3 pr-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
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
          <div class="w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark">Contact No. </label>
            <div class="relative">
              <input
                v-model="contactNo"
                :disabled="disabled"
                type="tel"
                placeholder="Contact No."
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
              />
              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/phone.svg" width="20" height="20" />
              </span>
            </div>
          </div>
          <div class="ml-2 w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark">
              Village <span class="req">*</span>
            </label>
            <div class="relative">
              <select
                v-model="village"
                :disabled="disabled"
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
              >
                <option value="SO">Srae Ou</option>
                <option value="KS">Krang Svat</option>
              </select>

              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/house.svg" width="20" height="20" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Row 4 -->
    <div class="flex flex-row w-full mb-2">
      <div class="ml-2 w-1/2">
        <label class="mb-1 block text-sm font-medium text-dark"
          >Family Group <span class="req">*</span></label
        >
        <div class="relative">
          <input
            v-model="familyGroup"
            :disabled="disabled"
            type="text"
            placeholder="Family Group"
            class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
          />
          <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
            <img src="@/assets/users.svg" width="20" height="20" />
          </span>
        </div>
      </div>
    </div>
    <!-- Row 5 -->
    <div class="flex flex-row w-full">
      <div class="w-1/2">
        <label class="mb-1 block text-sm font-medium text-dark">Drug Allergies</label>
        <div class="relative">
          <input
            v-model="drugAllergies"
            :disabled="disabled"
            type="text"
            :placeholder="disabled ? 'No drug allergies' : 'Enter Drug Allergies'"
            class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
          />
          <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
            <img src="@/assets/drug.svg" width="20" height="20" />
          </span>
        </div>
      </div>
    </div>
    <!-- Photo -->
    <div class="flex flex-row w-full mt-4">
      <div class="flex flex-col w-1/2">
        <div class="w-full">
          <label class="mb-1 block text-sm font-medium text-dark">Photo ID</label>
          <div :class="['relative', { 'bg-gray-200': disabled, 'bg-white': !disabled }]">
            <label
              for="file"
              class="flex w-full h-[11rem] justify-center items-center cursor-pointer rounded-md border border-dashed border-gray-300 p-3 mr-2"
            >
              <input
                type="file"
                name="file"
                id="file"
                class="sr-only"
                :disabled="disabled"
                @change="$emit('imageUpload', $event)"
                accept=".jpg,.jpeg,.png,.heic"
              />
              <img
                v-if="form.selectedPhoto.value"
                :src="form.selectedPhoto.value"
                alt="Selected Image"
                class="object-cover rounded-lg w-52 h-40"
              />
              <template v-else>
                <span class="flex items-center justify-center">
                  <img src="@/assets/camera.svg" height="20" width="20" />
                </span>
                <span class="text-sm text-body-color">
                  {{ disabled ? 'no Photo' : 'Add Photo ID' }}
                </span>
              </template>
            </label>
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { usePatientForm } from '@patient-record/composables/usePatientForm'
import { formatDateISO } from '@shared/utils/date'

const props = defineProps<{
  form: ReturnType<typeof usePatientForm>
  disabled?: boolean
  maxDate: string
}>()
defineEmits<{ imageUpload: [Event] }>()

function map<K extends keyof ReturnType<typeof usePatientForm>>(key: K) {
  const target = props.form[key] as any
  if (target && typeof target === 'object' && 'value' in target) {
    return computed({
      get: () => target.value,
      set: (v) => (target.value = v)
    })
  }
  return computed(() => target)
}

const name = map('name')
const khmerName = map('khmerName')
const dob = computed<string | null>({
  get() {
    const v = props.form.dob.value as Date
    return formatDateISO(v)
  },
  set(dateOnly: string | null) {
    props.form.setDob(dateOnly ? new Date(dateOnly) : props.form.dob.value)
  }
})
const gender = map('gender')
const village = map('village')
const familyGroup = map('familyGroup')
const contactNo = map('contactNo')
const drugAllergies = map('drugAllergies')
</script>
<style scoped>
.req {
  color: red;
}
</style>
