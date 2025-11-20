<template>
  <tr @click="handleClick">
    <td class="px-4 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ queueNo }}
      </p>
    </td>
    <td class="px-4 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ id }}
      </p>
    </td>
    <td class="px-10 py-4 text-sm border-b border-gray-200">
      <p
        class="whitespace-no-wrap inline-flex items-center gap-2"
        :class="sentToId ? 'text-red-600 font-semibold' : 'text-gray-900'"
      >
        <span>{{ name }}</span>
        <span
          v-if="sentToId"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 border border-red-300"
        >
          ID
        </span>
      </p>
    </td>
    <td class="px-10 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ khmerName }}
      </p>
    </td>
    <td class="px-3 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ gender }}
      </p>
    </td>
    <td class="px-5 py-3 text-sm border-b border-gray-200">
      <div v-if="allergies" class="text-gray-900 whitespace-no-wrap allergies yes">
        {{ allergies }}
      </div>
      <div v-else class="text-gray-900 whitespace-no-wrap allergies nil">Nil</div>
    </td>
    <td class="px-5 py-3 text-sm border-b border-gray-200">
      <div v-if="prescriptionLabel" class="text-gray-900 whitespace-no-wrap prescription" :class="prescriptionClass">
        {{ prescriptionLabel }}
      </div>
      <div v-else class="text-gray-500 whitespace-no-wrap prescription none">N/A</div>
    </td>
    <td class="px-7 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap" v-if="referralNeeded === true">Yes</p>
      <p class="text-gray-900 whitespace-no-wrap" v-else-if="referralNeeded === false">No</p>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  queueNo?: string
  id?: string
  vid?: string
  name?: string
  khmerName?: string
  gender?: string
  allergies?: string
  contactNumber?: string
  referralNeeded?: boolean
  sentToId?: boolean
  hasPrescriptionWithDrug?: boolean
  allPrescriptionDrugsPacked?: boolean
  prescriptionDispensed?: boolean
}>()

const router = useRouter()

const prescriptionLabel = computed(() => {
  if (!props.hasPrescriptionWithDrug) return 'No Rx'
  if (props.prescriptionDispensed) return 'Dispensed'
  if (props.allPrescriptionDrugsPacked) return 'Packed'
  return 'Pending'
})

const prescriptionClass = computed(() => {
  switch (prescriptionLabel.value) {
    case 'No Rx':
      return 'none'
    case 'Packed':
      return 'packed'
    case 'Dispensed':
      return 'dispensed'
    default:
      return 'none'
  }
})

function handleClick() {
  router.push({ name: 'patient-record', params: { id: props.id, vid: props.vid } })
}
</script>

<style>
.allergies {
  padding: 5px 20px;
  text-align: center;
  border-radius: 14px;
  width: fit-content;
  max-width: 90%;
  font-size: 0.75rem;
  font-weight: 600;
}
.allergies.nil {
  background-color: rgb(172, 249, 172);
}
.allergies.yes {
  background-color: rgb(255, 180, 180);
}

.prescription {
  padding: 5px 20px;
  text-align: center;
  border-radius: 14px;
  width: fit-content;
  max-width: 90%;
  font-size: 0.75rem;
  font-weight: 600;
}
.prescription.none {
  background-color: #e5e7eb;
  color: #374151;
}
.prescription.packed {
  background-color: #dbeafe;
  color: #1d4ed8;
}
.prescription.dispensed {
  background-color: #dcfce7;
  color: #166534;
}
</style>
