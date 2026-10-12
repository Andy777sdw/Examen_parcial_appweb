<script setup>
/**
 * Page Not Found View. Catch-all error view displayed when an unmatched route is requested. Shows the exact unmatched route and provides router-based navigation back to /home.
 *
 * @summary Presentation view for 404 unmatched route scenarios.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

function navigateHome() {
  router.push('/home');
}
</script>

<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen p-4 text-center">
    <div class="surface-card p-6 md:p-8 border-round-xl shadow-3 max-w-30rem w-full">
      <div class="inline-flex align-items-center justify-content-center bg-orange-100 border-circle w-6rem h-6rem mb-4">
        <i class="pi pi-exclamation-triangle text-orange-600 text-4xl" aria-hidden="true"></i>
      </div>

      <h1 class="text-3xl font-bold text-900 m-0 mb-2">
        404 - {{ t('not-found-title') }}
      </h1>

      <p class="text-600 text-base mb-4">
        {{ t('not-found-message') }}
      </p>

      <div class="surface-ground p-3 border-round border-1 surface-border mb-5 text-left">
        <span class="text-xs text-500 uppercase font-semibold block mb-1">Route</span>
        <code class="text-primary font-bold text-sm word-break-all">
          {{ route.path }}
        </code>
      </div>

      <pv-button
        :label="t('btn-back-home')"
        icon="pi pi-home"
        class="p-button-primary w-full p-button-lg"
        @click="navigateHome"
      />
    </div>
  </div>
</template>

<style scoped>
.max-w-30rem {
  max-width: 30rem;
}
.word-break-all {
  word-break: break-all;
}
</style>
