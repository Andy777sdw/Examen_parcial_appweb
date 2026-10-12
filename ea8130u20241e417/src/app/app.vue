<script setup>
/**
 * Root Application Component. Hosts the global layout and dynamic router views.
 *
 * @summary Root component of GeoMine Solutions application.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import DefaultLayout from '@/shared/presentation/layouts/default-layout.vue';
</script>

<template>
  <default-layout>
    <router-view />
  </default-layout>
</template>

<style>
/* Global resets and responsive typography */
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}
</style>
