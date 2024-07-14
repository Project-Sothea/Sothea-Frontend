<template>
    <div class="container max-w-3xl px-4 mx-auto sm:px-8 table">
        <div class="py-8">
            <div class="flex flex-row justify-between w-full mb-1 sm:mb-0">
                <h2 class="text-3xl leading-tight" style="color:black">
                    All Patients
                </h2>
            </div>

            <div class="flex justify-between items-center py-5" >
                <div class="relative flex-grow">
                    <input 
                        type="text" 
                        id="search-input" 
                        class="rounded-lg border-transparent appearance-none w-64 bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        placeholder="Search by Name/Khmer Name/ID"
                        @input="searchPatient"
                        @keyup.enter="searchPatient"
                    />
                </div>
                <router-link active-class="active">
                    <div class="flex items-center space-x-3">
                        <Text style="font-size:medium" class="hover:text-gray-500"
                        @click="getData()">Refresh List &#x21bb;</Text>
                    </div>
                </router-link>
            </div>

            <hr class="line" />

            <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 table">
                <div class="inline-block min-w-full overflow-hidden shadow table">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th scope="col"
                                    class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase border-b border-gray-200 hover:cursor-pointer"
                                    style="background: rgba(63, 81, 181, 0.3);"
                                    @click="sortById">
                                    Patient ID &udarr;
                                </th>
                                <th scope="col"
                                    class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Patient Name
                                </th>
                                <th scope="col"
                                    class="px-14 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Khmer Name
                                </th>
                                <th scope="col"
                                    class="px-3 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Gender
                                </th>
                                <th scope="col"
                                    class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    DOB
                                </th>
                                <th scope="col"
                                    class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Contact No.
                                </th>
                                <th scope="col"
                                    class="px-5 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Queued At
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow class="hover:cursor-pointer" v-for="(patient, index) in patients" :key="patient.id"
                                :id="patient.id" :name="patient.name" :khmername="patient.khmerName"
                                :gender="patient.gender" :DOB="patient.dob" :contactnumber="patient.contactNo"
                                :queuedat="getMockQueuedAt()" 
                                :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }"/>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
import TableRow from './TableRow.vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { BaseURL } from '@/main';

export default {
    components: {
        TableRow
    },
    data() {
        return {
            patients: [],
            patientsFixed: [], // for searching patients 
            token: null,
            sortAscId: true,
        }
    },
    methods: {
        async getData() {
            const toast = useToast()
            try {
                const { data } = await axios.get(`${BaseURL}/get-all-admin`);
                this.patients = data;  // Store the fetched data in the patients array
                this.patientsFixed = data;
                console.log(this.patients);
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.error)
                } else { // No response received at all
                    toast.error("An internal server error occurred.")
                }
            }
        },
        getMockQueuedAt() {
            // Generate a mock queuedat value
            const date = new Date();
            const hours = Math.floor(Math.random() * 24);
            const minutes = Math.floor(Math.random() * 60);
            date.setHours(hours, minutes);
            return date.toISOString();  // Return ISO string format of the date
        },
        searchPatient() {
            console.log('searching')
            // get value of the search input
            const searchValue = document.getElementById('search-input').value;
            // refresh the table of patients
            if (searchValue == "") {
                this.getData()
            }
            // filter patients array based on the search value
            this.patients = this.patientsFixed.filter(patient => {
                return patient.name.toLowerCase().includes(searchValue) ||
                    patient.name.includes(searchValue) ||
                    patient.id.toString().includes(searchValue) ||
                    patient.khmerName.toLowerCase().includes(searchValue);
            });
        },
        sortById() {
            this.patients.sort((a, b) => {
                if (this.sortAscId) {
                    return a.id - b.id;
                } else {
                    return b.id - a.id;
                }
            });
            this.sortAscId = !this.sortAscId;
        }
    },
    created() {
        this.getData();
    }
}

</script>

<style>
.table {
    width: 1240px;
}

.table-heading {
    background: rgba(63, 81, 181);
}

.line {
    height: 1px;
    background: rgba(0, 0, 0, 0.17);
}

.even-row {
    background-color: #ffffff;
}

.odd-row {
    background-color: #f2f2f2;
}
</style>