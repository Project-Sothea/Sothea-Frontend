<template>
    <tr @click="handleClick">
        <td class="px-5 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ id }}
            </p>
        </td>
        <td class="px-10 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ name }}
            </p>
        </td>
        <td class="px-14 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ khmername }}
            </p>
        </td>
        <td class="px-3 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ gender }}
            </p>
        </td>
        <td class="px-5 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ formattedDOB }}
            </p>
        </td>
        <td class="px-5 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ contactnumber }}
            </p>
        </td>
        <td class="px-5 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap">
                {{ formattedQueuedAt }}
            </p>
        </td>
    </tr>    
</template>

<script>
export default {
    props: {
        id: String,
        name: String,
        khmername: String,
        gender: String,
        DOB: String,
        contactnumber: String,
        queuedat: String
    },
    computed: {
        formattedDOB() {
            const date = new Date(this.DOB);
            return date.toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric', year: 'numeric'});
        },
        formattedQueuedAt() {
            const date = new Date(this.queuedat);
            return date.toLocaleTimeString('en-CA', {timeStyle: 'short'});
        }
    },
    methods: {
        handleClick() {
            this.$router.push({ name: 'patient', params: { id: this.id } });
        }
    }
}
</script>


<style>

</style>