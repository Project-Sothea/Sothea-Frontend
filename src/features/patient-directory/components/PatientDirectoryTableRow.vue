<template>
  <tr @click="handleClick">
    <td class="px-5 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ id }}
      </p>
    </td>
    <td class="px-5 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ formattedRegDate }}
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
    <td class="px-5 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ familyGroup }}
      </p>
    </td>
    <td class="px-5 py-4 text-sm border-b border-gray-200">
      <p class="text-gray-900 whitespace-no-wrap">
        {{ contactNumber }}
      </p>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatDateDMY } from '@shared/utils/date'

const props = defineProps<{
  id?: string
  vid?: string
  regDate?: string
  name?: string
  khmerName?: string
  gender?: string
  familyGroup?: string
  contactNumber?: string
}>()

const router = useRouter()

const formattedRegDate = computed(() => formatDateDMY(props.regDate))

function handleClick() {
  router.push({ name: 'patient-record', params: { id: props.id, vid: props.vid } })
}
</script>

<style></style>
