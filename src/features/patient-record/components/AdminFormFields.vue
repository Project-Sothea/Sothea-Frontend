<template>
  <div>
    <div class="flex flex-row w-full">
      <div class="flex flex-col flex-1">
        <div class="flex flex-row mb-2">
          <div class="w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Date Registered <span class="req">*</span></label
            >
            <div class="relative z-20">
              <input
                v-model="regDate"
                :disabled="disabled"
                type="date"
                :max="maxDate"
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200 disabled:border-gray-2"
              />
            </div>
          </div>
          <div class="ml-2 w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Queue Number <span class="req">*</span></label
            >
            <div class="relative">
              <input
                v-model="queueNo"
                :disabled="disabled"
                type="text"
                placeholder="Queue Number"
                class="w-full bg-transparent rounded-md border border-stroke py-1.5 pr-3 pl-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
              />
              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/queueno.svg" width="20" height="20" />
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-row mb-2">
          <div class="w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Pregnant? <span class="req">*</span></label
            >
            <div class="relative z-20">
              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/pregnantwoman.svg" width="25" height="25" />
              </span>
              <select
                v-model="pregnant"
                :disabled="disabled || isMale"
                class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-[#3f51b5]/50 disabled:border-gray-2"
              >
                <option :value="true">Y</option>
                <option :value="false">N</option>
              </select>
              <span class="absolute top-1/2 right-4 z-10 -translate-y-1/2">
                <img src="@/assets/chevrondown.svg" height="20" width="20" />
              </span>
            </div>
          </div>
          <div class="ml-2 w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark">Last Menstrual Period</label>
            <div class="relative z-20">
              <input
                v-model="lastMenstrualPeriod"
                :disabled="disabled || isMale"
                type="date"
                :max="maxDate"
                :class="[
                  'w-full rounded-md border border-stroke py-1.5 px-3 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:border-gray-2',
                  disabled || isMale ? 'bg-[#3f51b5]/50 disabled:bg-[#3f51b5]/50' : 'bg-transparent'
                ]"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-row mb-2">
          <div class="w-1/2">
            <label class="mb-1 block text-sm font-medium text-dark"
              >Sent to Infectious Disease? <span class="req">*</span></label
            >
            <div class="relative z-20">
              <span class="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-30">
                <img src="@/assets/mask.svg" width="25" height="25" />
              </span>
              <select
                v-model="sentToId"
                :disabled="disabled"
                class="relative z-20 w-full appearance-none rounded-md border border-stroke bg-transparent py-1.5 pl-12 pr-12 text-dark-6 outline-none transition focus:border-primary disabled:cursor-default disabled:bg-gray-200"
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
      </div>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useAdminForm } from '@patient-record/composables/useAdminForm'
import { formatDateISO } from '@shared/utils/date'

const props = defineProps<{
  form: ReturnType<typeof useAdminForm>
  disabled?: boolean
  maxDate: string
  gender?: 'M' | 'F' | ''
}>()

function map<K extends keyof ReturnType<typeof useAdminForm>>(key: K) {
  const target = props.form[key] as any
  if (target && typeof target === 'object' && 'value' in target) {
    return computed({
      get: () => target.value,
      set: (v) => (target.value = v)
    })
  }
  return computed(() => target)
}

const regDate = computed<string>({
  get() {
    const v = props.form.regDate.value as Date
    return formatDateISO(v)
  },
  set(dateOnly: string) {
    props.form.setRegDate(new Date(dateOnly))
  }
})
const queueNo = map('queueNo')
const isMale = computed(() => props.gender === 'M')
const pregnant = computed({
  get: () => (isMale.value ? false : props.form.pregnant.value),
  set: (v: boolean | null) => {
    if (isMale.value) {
      props.form.pregnant.value = false
      return
    }
    props.form.pregnant.value = v
  }
})
const lastMenstrualPeriod = computed<string | null>({
  get() {
    const v = isMale.value ? null : (props.form.lastMenstrualPeriod.value as Date | null)
    return v ? formatDateISO(v) : null
  },
  set(dateOnly: string | null) {
    if (isMale.value) {
      props.form.setLastMenstrualPeriod(null)
      return
    }
    props.form.setLastMenstrualPeriod(dateOnly ? new Date(dateOnly) : null)
  }
})
const sentToId = map('sentToId')
</script>
<style scoped>
.req {
  color: red;
}
</style>
