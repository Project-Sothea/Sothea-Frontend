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

const props = defineProps({
  id: String,
  vid: String,
  regDate: String,
  name: String,
  khmerName: String,
  gender: String,
  familyGroup: String,
  contactNumber: String
})

const router = useRouter()

const formattedRegDate = computed(() => {
  const date = new Date(props.regDate ?? '')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
})

function handleClick() {
  router.push({ name: 'patient', params: { id: props.id, vid: props.vid } })
}
</script>

<style></style>
