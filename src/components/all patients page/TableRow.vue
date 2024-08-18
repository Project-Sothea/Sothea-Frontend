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

<script>
export default {
    props: {
        id: String,
        vid: String,
        regDate: String,
        name: String,
        khmerName: String,
        gender: String,
        familyGroup: String,
        contactNumber: String,
    },
    computed: {
        formattedRegDate() {
            const date = new Date(this.regDate);
            return date.toISOString().split('T')[0];
        },
    },
    methods: {
        handleClick() {
            this.$router.push({ name: 'patient', params: { id: this.id, vid: this.vid } });
        }
    }
}
</script>


<style>

</style>