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
                            class="rounded-lg border-transparent appearance-none w-[26rem] bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            placeholder="Search by Queue No/ID/Name/Khmer Name/Drug Allergies" @input="searchPatient"
                            @keyup.enter="searchPatient" />
                    </div>
                    <div>
                        <input type="date" id="date-input"
                            class="rounded-lg border-transparent appearance-none w-48 bg-gray-300 border border-gray-300 py-3 px-5 text-gray-700 placeholder-gray-400 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            v-model="dateInput" @input="filterPatientsByDate(this)" :max="maxDate"/>
                    </div>
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
            dateInput: '', // format: YYYY-MM-DD, local timezone
            maxDate: this.formatDateForInput(new Date())  // Set maxDate to today's local date, format: YYYY-MM-DD
        }
    },
    mounted() {
        // Retrieve the date from localStorage and set it as the input value
        const storedDate = localStorage.getItem('date-input');
        this.dateInput = storedDate || this.formatDateForInput(new Date()); // Default to today if no stored date
    },
    methods: {
        async getData() {
            const toast = useToast()
            try {
                const storedDate = localStorage.getItem('date-input');
                const dateToRetrieve = storedDate ? this.convertLocalToUTC(new Date(storedDate)) : this.convertLocalToUTC(new Date()); // Default to today if no stored date
                const { data } = await axios.get(`${BaseURL}/all-patient-visit-meta/${dateToRetrieve}`);
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
        searchPatient() {
            // get value of the search input
            const searchValue = document.getElementById('search-input').value.toLowerCase();
            // refresh the table of patients
            if (searchValue == "") {
                this.getData()
            }
            // filter patients array based on the search value
            this.patientVisits = this.patientVisitsFixed.filter(patient => {
                return patient.queueNo?.toLowerCase().includes(searchValue) ||
                    patient.name?.toLowerCase().includes(searchValue) ||
                    patient.id?.toString().includes(searchValue) ||
                    patient.khmerName?.toLowerCase().includes(searchValue) ||
                    (patient.drugAllergies ?? "").toLowerCase().includes(searchValue);
            });
        },
        async filterPatientsByDate() {
            const toast = useToast()
            try {
                const date = document.getElementById('date-input').value;
                localStorage.setItem('date-input', date);
                const dateToRetrieve = this.convertLocalToUTC(new Date(date))
                const { data } = await axios.get(`${BaseURL}/all-patient-visit-meta/${dateToRetrieve}`);
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
        },
        formatDateForInput(date: Date) {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')

            return `${year}-${month}-${day}`
        },
        convertLocalToUTC(date: Date) {
            return date.toISOString().split('T')[0];
        },
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