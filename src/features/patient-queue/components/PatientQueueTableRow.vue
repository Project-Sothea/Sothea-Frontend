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
      <p class="text-gray-900 whitespace-no-wrap">
        {{ name }}
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
    <td class="px-7 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap" v-if="referralNeeded === true">Yes</p>
      <p class="text-gray-900 whitespace-no-wrap" v-else-if="referralNeeded === false">No</p>
    </td>
  </tr>
</template>

<script setup lang="ts">
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
}>()

const router = useRouter()

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
}
.allergies.nil {
  background-color: rgb(172, 249, 172);
}
.allergies.yes {
  background-color: rgb(255, 180, 180);
}
</style>
