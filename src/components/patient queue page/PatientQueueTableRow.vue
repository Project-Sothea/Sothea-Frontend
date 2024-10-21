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
                {{ khmername }}
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
            <div v-else class="text-gray-900 whitespace-no-wrap allergies nil">
                Nil
            </div>
        </td>
        <td class="px-7 py-4 text-sm border-b border-gray-200">
            <p class="text-gray-900 whitespace-no-wrap" v-if="referralneeded == true">
                Yes 
            </p>
            <p class="text-gray-900 whitespace-no-wrap" v-else-if="referralneeded == false">
                No
            </p>
        </td>
    </tr>    
</template>

<script>
export default {
    props: {
        queueNo: String,
        id: String,
        vid: String,
        name: String,
        khmername: String,
        gender: String,
        allergies: String,
        contactnumber: String,
        referralneeded: Boolean
    },
    methods: {
        handleClick() {
            this.$router.push({ name: 'patient', params: { id: this.id, vid: this.vid } });
        }
    }
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