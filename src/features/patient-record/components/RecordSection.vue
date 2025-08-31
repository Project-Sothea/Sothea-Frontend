<template>
  <div>
    <div
      :class="
        currVisit ? 'bg-[#3F51B5] text-white rounded-md' : 'bg-[#c3ccff] text-[#3F51B5] rounded-md'
      "
    >
      <button
        class="flex items-center align-center justify-between w-full rounded-md px-4 py-2 font-normal text-sm mb-2 mt-2"
        @click="handleClick"
      >
        <span>{{ formattedDate }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// Record Section takes vid, id and date as props, date is just used for displaying
const props = defineProps<{
  id: string
  vid: string
  currVisit: boolean
  date: string
}>()

const emit = defineEmits<{
  close: [void]
}>()

const router = useRouter()

const formattedDate = computed(() => {
  if (!props.date) return null
  const date = new Date(props.date)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
})

function handleClick() {
  router.push({ name: 'patient', params: { id: props.id, vid: props.vid } })
  emit('close')
}
</script>
