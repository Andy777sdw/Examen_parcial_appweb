<script setup>
/**
 * Home View. Primary operations view displaying dashboard greeting, overview title, and the machinery inspection summary grid.
 *
 * @summary Home presentation view for inspection management.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInspectionStore } from '@/inspections/stores/inspection.store.js';
import InspectionSummary from '@/inspections/presentation/components/inspection-summary.vue';

const { t } = useI18n();
const inspectionStore = useInspectionStore();

onMounted(async () => {
  if (inspectionStore.inspections.length === 0) {
    await inspectionStore.loadAllData();
  }
});

async function reloadData() {
  await inspectionStore.loadAllData();
}
</script>

<template>
  <div class="p-4 md:p-6 max-w-7xl mx-auto">
    <!-- View Header -->
    <header class="mb-5 pb-3 border-bottom-1 surface-border flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
      <div>
        <h1 class="text-3xl font-bold text-900 m-0">
          {{ t('home-title') }}
        </h1>
        <p class="text-lg text-600 m-0 mt-2 font-medium">
          {{ t('home-welcome') }}
        </p>
      </div>

      <div class="flex gap-2">
        <pv-button
          icon="pi pi-refresh"
          :label="t('btn-refresh') || 'Refresh'"
          class="p-button-outlined"
          :loading="inspectionStore.loading"
          @click="reloadData"
        />
        <router-link to="/telemetry/items/new" custom v-slot="{ navigate }">
          <pv-button
            icon="pi pi-plus"
            :label="t('nav-new-telemetry')"
            class="p-button-primary"
            @click="navigate"
          />
        </router-link>
      </div>
    </header>

    <!-- Section Title -->
    <div class="flex align-items-center justify-content-between mb-4">
      <h2 class="text-2xl font-bold text-800 m-0 flex align-items-center gap-2">
        <i class="pi pi-wrench text-primary" aria-hidden="true"></i>
        {{ t('my-inspections') }}
      </h2>
      <span v-if="inspectionStore.inspections.length > 0" class="text-sm font-semibold text-500">
        {{ inspectionStore.inspections.length }} records
      </span>
    </div>

    <!-- Loading State -->
    <div
      v-if="inspectionStore.loading && inspectionStore.inspections.length === 0"
      class="flex flex-column align-items-center justify-content-center py-8 text-center"
    >
      <pv-progress-spinner aria-label="Loading inspections" />
      <p class="text-600 mt-3 font-medium">{{ t('loading-inspections') }}</p>
    </div>

    <div v-else-if="inspectionStore.error" class="my-4">
      <pv-message severity="error" :closable="false">
        <div class="flex align-items-center justify-content-between w-full">
          <span>{{ inspectionStore.error }}</span>
          <pv-button
            icon="pi pi-refresh"
            label="Retry"
            class="p-button-sm p-button-text ml-3"
            @click="reloadData"
          />
        </div>
      </pv-message>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="inspectionStore.inspections.length === 0"
      class="surface-card p-6 border-round-lg shadow-1 text-center py-8 my-4"
    >
      <i class="pi pi-folder-open text-500 text-5xl mb-3" aria-hidden="true"></i>
      <h3 class="text-xl font-bold text-900 m-0">{{ t('empty-inspections-title') }}</h3>
      <p class="text-600 mt-2 mb-4">{{ t('empty-inspections-message') }}</p>
      <pv-button
        icon="pi pi-refresh"
        label="Reload"
        class="p-button-outlined"
        @click="reloadData"
      />
    </div>

    <section v-else aria-label="Inspections summary list">
      <inspection-summary :inspections="inspectionStore.inspections" />
    </section>
  </div>
</template>

<style scoped>
.max-w-7xl {
  max-width: 80rem;
}
</style>
