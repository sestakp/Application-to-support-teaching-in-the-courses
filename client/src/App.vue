<template>
    <NavbarComponent />
    <Toast position="bottom-right" />
    <router-view/>
    <ConfirmDialog />
</template>

<script lang="ts">
import NavbarComponent from '@/components/NavbarComponent.vue';
import ConfirmDialog from 'primevue/confirmdialog';
export default {
    name: 'App',
    components: {
        NavbarComponent,
        ConfirmDialog,
    },
};
</script>

<style lang="scss">
    @import "App.scss";
</style>
