<template>
  <p
    class="text-sm text-red-500 hidden data-[visible=true]:block"
    :data-visible="age !== null && age <= 16"
  >
    PAEDS required
  </p>

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
    <div class="col-span-1 space-y-3 lg:col-span-2">
      <!-- Row 1: Name, Khmer Name -->
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <!-- Name -->
        <div>
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
        <div>
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

      <!-- Row 2: DOB, Age, Gender -->
      <div class="grid grid-cols-1 gap-2 md:grid-cols-4">
        <div class="md:col-span-2">
          <label for="patient-dob" class="mb-1 block text-sm font-medium text-dark">DOB
            <span class="req">*</span>
          </label>
          <div class="relative z-40">
            <VueDatePicker
              v-model="dob"
              :disabled="disabled"
              :max-date="maxDate"
              :time-config="{ enableTimePicker: false }"
              :formats="{ input: 'dd/MM/yyyy' }"
              :text-input="{
                format: parseDobInput,
                enterSubmit: true,
                tabSubmit: true,
                openMenu: 'open'
              }"
              :input-attrs="{
                id: 'patient-dob', clearable: false, inputmode: 'text', required: true,
                state: form.dobInputError.value ? false : undefined
              }"
              :aria-labels="{ input: 'Date of birth', calendarIcon: 'Choose date of birth' }"
              auto-apply
              placeholder="DD/MM/YYYY"
              :data-warning="age !== null && age <= 16"
              class="dob-picker data-[warning=true]:[--dp-background-color:theme('colors.red.200')] data-[warning=true]:![--dp-disabled-color:theme('colors.red.200')] "
              @text-input="validateDobInput"
            />
          </div>
          <p v-if="form.dobInputError.value" class="mt-1 text-sm text-red-500" role="alert">
            {{ form.dobInputError.value }}
          </p>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-dark">Age</label>
          <input
            :value="form.ageComputed.value"
            readonly
            disabled
            class="w-full bg-[#3f51b5]/50 rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none disabled:cursor-default"
          />
        </div>
        <div>
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

      <!-- Row 3: Contact, Village -->
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
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
        <div>
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

      <!-- Row 4: Family Group, Drug Allergies -->
      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
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
        <div>
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
    </div>

    <div class="col-span-1">
      <div class="flex h-full flex-col">
        <label class="mb-1 block text-sm font-medium text-dark">Photo ID</label>
        <div :class="['relative', { 'bg-gray-200': disabled, 'bg-white': !disabled }]">
          <label
            for="file"
            class="flex h-full min-h-[18rem] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 p-3"
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
              class="h-40 w-52 rounded-lg object-cover"
            />
            <template v-else>
              <span class="flex items-center justify-center">
                <img src="@/assets/camera.svg" height="20" width="20" />
              </span>
              <span class="text-sm text-body-color">
                {{ disabled ? 'No Photo' : 'Add Photo ID' }}
              </span>
            </template>
          </label>
        </div>
      </div>
    </div>
  </div>
  <slot />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { isValid, parse } from 'date-fns'
import { usePatientForm } from '@patient-record/composables/usePatientForm'

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
const dob = computed<Date>({
  get: () => props.form.dob.value,
  set(value: Date | null) {
    if (value && isValid(value)) props.form.setDob(value)
  }
})

function parseDobInput(value: string): Date | null {
  // Do not commit intermediate years while the user is still typing.
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) return null
  const date = parse(value, 'd/M/yyyy', new Date())
  return isValid(date) ? date : null
}

function validateDobInput(event: Event | string) {
  const value = typeof event === 'string' ? event : (event.target as HTMLInputElement).value
  const date = parseDobInput(value)
  const maxDate = parse(props.maxDate, 'yyyy-MM-dd', new Date())
  props.form.dobInputError.value = !value
    ? 'Date of Birth is required'
    : !date || date > maxDate
      ? 'Enter a valid Date of Birth (DD/MM/YYYY) that is not in the future'
      : null
}

const age = computed(() => props.form.ageComputed.value)
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

.dob-picker {
  --dp-font-family: inherit;
  --dp-border-radius: 6px;
  --dp-primary-color: #3f51b5;
  --dp-input-padding: 6px 12px 6px 35px;
  --dp-disabled-color: #e5e7eb;
  --dp-icon-color: #000000;
}

.dob-picker :deep(.dp--input) {
  min-height: 38px;
}

.dob-picker[data-warning='true'] :deep(.dp--input:not(:disabled)) {
  background-color: #fecaca;
}
</style>
