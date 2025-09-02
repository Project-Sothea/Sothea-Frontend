<template>
  <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 table">
    <div class="inline-block min-w-full overflow-hidden shadow table">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase border-b border-gray-200 hover:cursor-pointer"
              style="background: rgba(63, 81, 181, 0.3)"
              @click="emit('sortById')"
            >
              <span class="inline-flex items-center">
                Patient ID
                <span class="ml-1 inline-block text-[10px] leading-none w-3 text-center">
                  <template v-if="sortKey === 'id'">
                    <span v-if="sortAsc">▲</span>
                    <span v-else>▼</span>
                  </template>
                  <template v-else>
                    <span class="text-gray-500 opacity-60">▲</span>
                  </template>
                </span>
              </span>
            </th>
            <th
              scope="col"
              class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
              style="background: rgba(63, 81, 181, 0.3)"
            >
              Reg Date
            </th>
            <th
              scope="col"
              class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
              style="background: rgba(63, 81, 181, 0.3)"
            >
              Patient Name
            </th>
            <th
              scope="col"
              class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
              style="background: rgba(63, 81, 181, 0.3)"
            >
              Khmer Name
            </th>
            <th
              scope="col"
              class="px-3 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
              style="background: rgba(63, 81, 181, 0.3)"
            >
              Gender
            </th>
            <th
              scope="col"
              class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
              style="background: rgba(63, 81, 181, 0.3)"
            >
              Family Group
            </th>
            <th
              scope="col"
              class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
              style="background: rgba(63, 81, 181, 0.3)"
            >
              Contact No.
            </th>
          </tr>
        </thead>
        <tbody>
          <TableRow
            class="hover:cursor-pointer"
            v-for="(patientVisit, index) in items"
            :key="patientVisit.id"
            :id="String(patientVisit.id)"
            :vid="String(patientVisit.vid)"
            :regDate="patientVisit.regDate"
            :name="patientVisit.name"
            :khmerName="patientVisit.khmerName"
            :gender="patientVisit.gender"
            :familyGroup="patientVisit.familyGroup"
            :contactNumber="patientVisit.contactNo"
            :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import TableRow from '@features/patient-directory/components/PatientDirectoryTableRow.vue'
import type PatientVisitMeta from '@shared/types/PatientVisitMeta'

defineProps<{ items: PatientVisitMeta[]; sortKey: null | 'id'; sortAsc: boolean }>()

const emit = defineEmits<{ (e: 'sortById'): void }>()
</script>

<style scoped>
.table {
  width: 1240px;
}
.even-row {
  background-color: #ffffff;
}
.odd-row {
  background-color: #f2f2f2;
}
</style>
