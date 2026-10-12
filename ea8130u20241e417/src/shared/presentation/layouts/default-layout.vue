<script setup>
/**
 * Default Application Layout. Implements the global responsive layout structure consisting of the Material top toolbar persistent desktop sidebar, collapsible mobile drawer, and main content routing area.
 *
 * @summary Default global application layout.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { ref } from 'vue';
import AppToolbar from '@/shared/presentation/components/app-toolbar.vue';
import AppSidebar from '@/shared/presentation/components/app-sidebar.vue';

const isMobileDrawerOpen = ref(false);

function toggleSidebar() {
  isMobileDrawerOpen.value = !isMobileDrawerOpen.value;
}

function closeMobileDrawer() {
  isMobileDrawerOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen flex flex-column surface-ground">
    <pv-toast position="top-right" />
    <pv-confirm-dialog />

    <!-- Top Application Toolbar -->
    <app-toolbar @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar and Content -->
    <div class="flex flex-1 overflow-hidden" style="min-height: calc(100vh - 4rem);">
      <!-- Persistent Desktop Sidebar -->
      <aside
        class="hidden lg:flex flex-column w-18rem surface-card border-right-1 surface-border sticky top-4rem z-4"
        style="height: calc(100vh - 4rem);"
        aria-label="Desktop Navigation Sidebar"
      >
        <app-sidebar />
      </aside>

      <!-- Mobile Collapsible Drawer -->
      <pv-drawer
        v-model:visible="isMobileDrawerOpen"
        position="left"
        class="w-20rem p-0"
        header="GeoMine Navigation"
      >
        <app-sidebar @navigate="closeMobileDrawer" />
      </pv-drawer>

      <!-- Main Router Content -->
      <main class="flex-1 overflow-y-auto" role="main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.top-4rem {
  top: 4rem;
}
</style>
