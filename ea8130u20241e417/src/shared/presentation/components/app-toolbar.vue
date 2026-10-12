<script setup>
/**
 * Application Toolbar Component. Header toolbar exhibiting GeoMine branding, official management title and responsive mobile drawer toggle button.
 *
 * @summary Top application toolbar component.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineEmits(['toggle-sidebar']);

const { t } = useI18n();
const logoFailed = ref(false);

function handleLogoError() {
  logoFailed.value = true;
}
</script>

<template>
  <pv-toolbar class="border-none shadow-2 px-3 py-2 surface-0 sticky top-0 z-5" style="border-radius: 0;">
    <template #start>
      <div class="flex align-items-center gap-2">
        <pv-button
          icon="pi pi-bars"
          class="p-button-text p-button-rounded lg:hidden text-700 mr-2"
          aria-label="Toggle navigation menu"
          @click="$emit('toggle-sidebar')"
        />

        <div class="flex align-items-center gap-2">
          <img
            v-if="!logoFailed"
            src="https://geomine.com/wp-content/uploads/2021/04/geomine-logo.png"
            alt="GeoMine Logo"
            class="h-2rem max-h-2rem object-contain"
            @error="handleLogoError"
          />
          <div
            v-else
            class="surface-900 text-white font-bold px-2 py-1 border-round text-sm flex align-items-center gap-1"
            aria-label="GeoMine Solutions"
          >
            <i class="pi pi-compass text-amber-400" aria-hidden="true"></i>
            <span>GEOMINE</span>
          </div>

          <span class="font-bold text-900 text-base md:text-lg tracking-tight ml-2">
            {{ t('app-title') }}
          </span>
        </div>
      </div>
    </template>

    <template #end>
      <div class="flex align-items-center gap-2">
        <span class="text-xs font-semibold surface-100 text-700 px-2 py-1 border-round hidden sm:inline-block">
          v1.0.0
        </span>
      </div>
    </template>
  </pv-toolbar>
</template>

<style scoped>
.object-contain {
  object-fit: contain;
}
.tracking-tight {
  letter-spacing: -0.02em;
}
</style>
