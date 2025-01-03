<template>
    <v-overlay v-model="loading" class="align-center justify-center">
        <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate
        ></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
    data() {
        return {
            loading: true,
        };
    },
};
</script>
<style scoped></style>