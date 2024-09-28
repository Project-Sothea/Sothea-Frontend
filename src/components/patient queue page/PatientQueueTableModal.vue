<template>
    <div class="container max-w-3xl px-4 mx-auto sm:px-8 table">
        <div class="py-8">
            <div class="flex flex-row justify-between w-full mb-1 sm:mb-0">
                <h2 class="text-3xl leading-tight" style="color:black">
                    Patient Queue
                </h2>
            </div>

            <div class="flex justify-between items-center py-5">
                <div class="relative flex-grow flex flex-row">
                    <div class="mr-2">
                        <input type="text" id="search-input"
                            class="rounded-lg border-transparent appearance-none w-[22rem] bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            placeholder="Search by ID/Name/Khmer Name/Drug Allergies" @input="searchPatient"
                            @keyup.enter="searchPatient" />
                    </div>
                    <div>
                        <input type="date" id="date-input"
                            class="rounded-lg border-transparent appearance-none w-48 bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            v-model="dateInput" @input="filterPatientsByDate(this)" />
                    </div>
                </div>
                <div class="flex items-center space-x-3 mx-5 hover:cursor-pointer">
                    <p style="font-size:medium" class="hover:text-gray-500" @click="exportPatientData()">Export
                        Patient Data &#x2913;</p>
                </div>
                <div class="flex items-center space-x-3 hover:cursor-pointer">
                    <p style="font-size:medium" class="hover:text-gray-500" @click="getData()">Refresh List
                        &#x21bb;</p>
                </div>
            </div>

            <hr class="line" />

            <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 table">
                <div class="inline-block min-w-full overflow-hidden shadow table">
                    <table class="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th scope="col"
                                    class="px-4 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Queue No.
                                </th>
                                <th scope="col"
                                    class="px-4 py-5 text-sm font-medium text-left text-gray-800 uppercase border-b border-gray-200 hover:cursor-pointer"
                                    style="background: rgba(63, 81, 181, 0.3);" @click="sortById">
                                    Patient ID &udarr;
                                </th>
                                <th scope="col"
                                    class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);">
                                    Patient Name
                                </th>
                                <th scope="col"
                                    class="px-10 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
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
                                    Allergies
                                </th>
                                <th scope="col"
                                    class="px-7 py-5 text-sm font-medium text-left text-gray-800 uppercase bg-indigo-200 border-b border-gray-200"
                                    style="background: rgba(63, 81, 181, 0.3);" @click="sortByReferral">
                                    Referral &udarr;
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <TableRow class="hover:cursor-pointer" v-for="(patientVisit, index) in patientVisits"
                                :key="patientVisit.id" :queueNo="patientVisit.queueNo" :id="String(patientVisit.id)"
                                :vid="String(patientVisit.vid)" :name="patientVisit.name"
                                :khmername="patientVisit.khmerName" :gender="patientVisit.gender"
                                :allergies="patientVisit.drugAllergies" :referralneeded="patientVisit.referralNeeded"
                                :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }" />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>


</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import TableRow from './PatientQueueTableRow.vue';
import axios, { AxiosError } from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { BaseURL } from '@/main';

export default defineComponent({
    components: {
        TableRow
    },
    data() {
        return {
            patientVisits: [],
            patientVisitsFixed: [], // for searching patients 
            token: null,
            sortAscId: true,
            sortAscReferral: true,
            dateInput: ''
        }
    },
    mounted() {
        // Retrieve the date from localStorage and set it as the input value
        const storedDate = localStorage.getItem('date-input');
        this.dateInput = storedDate || new Date().toISOString().split('T')[0]; // Default to today if no stored date
    },
    methods: {
        async getData() {
            const toast = useToast()
            try {
                const storedDate = localStorage.getItem('date-input');
                const todayDate = storedDate ? storedDate : new Date().toISOString().split('T')[0];
                const { data } = await axios.get(`${BaseURL}/all-patient-visit-meta/${todayDate}`);
                this.patientVisits = data;  // Store the fetched data in the patients array
                this.patientVisitsFixed = data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError; // Safe casting
                    if (axiosError.response) {
                        // The request was made and server responded with a status code out of range 2xx
                        console.log(axiosError.response.data)
                        toast.error(axiosError.message)
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request)
                        toast.error('No server response received, check your connection.')
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', axiosError.message);
                        toast.error('An internal server error occurred.')
                    }
                } else {
                    // No response received at all
                    console.log(error)
                    toast.error('An internal server error occurred.')
                }
            }
        },
        async exportPatientData() {
            const toast = useToast()

            try {
                axios({
                    url: `${BaseURL}/export-db`,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'patientdata.csv');
                    document.body.appendChild(link);
                    link.click();
                    // Cleanup
                    link.parentNode.removeChild(link);
                    window.URL.revokeObjectURL(url);
                });
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.error)
                } else { // No response received at all
                    toast.error("An internal server error occurred.")
                }
            }
        },
        searchPatient() {
            // get value of the search input
            const searchValue = document.getElementById('search-input').value;
            // refresh the table of patients
            if (searchValue == "") {
                this.getData()
            }
            // filter patients array based on the search value
            this.patientVisits = this.patientVisitsFixed.filter(patient => {
                return patient.name.toLowerCase().includes(searchValue) ||
                    patient.name.includes(searchValue) ||
                    patient.id.toString().includes(searchValue) ||
                    patient.khmerName.toLowerCase().includes(searchValue) ||
                    (patient.drugAllergies !== undefined && patient.drugAllergies !== null) ? patient.drugAllergies.toLowerCase().includes(searchValue) : false;
            });
        },
        async filterPatientsByDate() {
            const toast = useToast()
            try {
                const date = document.getElementById('date-input').value;
                localStorage.setItem('date-input', date);
                const { data } = await axios.get(`${BaseURL}/all-patient-visit-meta/${date}`);
                this.patientVisits = data;
                this.patientVisitsFixed = data;
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.error)
                } else { // No response received at all
                    toast.error("An internal server error occurred.")
                }
            }
        },
        sortById() {
            this.patientVisits.sort((a, b) => {
                if (this.sortAscId) {
                    return a.id - b.id;
                } else {
                    return b.id - a.id;
                }
            });
            this.sortAscId = !this.sortAscId;
        },
        sortByReferral() {
            this.patientVisits.sort((a, b) => {
                const referralA = (a.referralNeeded !== undefined && a.referralNeeded !== null) ? a.referralNeeded : null;
                const referralB = (b.referralNeeded !== undefined && b.referralNeeded !== null) ? b.referralNeeded : null;

                if (referralA === referralB) return 0;

                if (this.sortAscReferral) {
                    return referralA === null ? 1 : referralB === null ? -1 : referralA < referralB ? -1 : 1;
                } else {
                    return referralA === null ? 1 : referralB === null ? -1 : referralA > referralB ? -1 : 1;
                }
            });
            this.sortAscReferral = !this.sortAscReferral;
        }
    },
    created() {
        this.getData();
    }
})

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