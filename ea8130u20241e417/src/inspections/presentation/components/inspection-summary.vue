<script setup>
/**
 * Inspection Summary Component. Reusable presentation component displaying heavy machinery inspection cards in a responsive grid (two per row on desktop) with joined catalog details, associated telemetry sensor readings, and calculated operating capacity metrics.
 *
 * @summary Reusable component for inspection summary cards.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { CapacityService } from '@/inspections/domain/services/capacity.service.js';

const props = defineProps({
  inspections: {
    type: Array,
    required: true,
    default: () => []
  }
});

const { t, locale } = useI18n();

/**
 * Returns PrimeVue Tag severity according to inspection status.
 */
function getStatusSeverity(status) {
  switch (status?.toUpperCase()) {
    case 'OPERATIONAL':
      return 'success';
    case 'MAINTENANCE_REQUIRED':
      return 'warn';
    case 'INACTIVE':
      return 'danger';
    default:
      return 'info';
  }
}

/**
 * Translates status code into localized label.
 */
function getStatusLabel(status) {
  switch (status?.toUpperCase()) {
    case 'OPERATIONAL':
      return t('status-operational');
    case 'MAINTENANCE_REQUIRED':
      return t('status-maintenance-required');
    case 'INACTIVE':
      return t('status-inactive');
    default:
      return status;
  }
}

/**
 * Formats numeric metrics using active locale.
 */
function formatHours(hours) {
  return CapacityService.formatNumber(hours, locale.value, 1);
}
</script>

<template>
  <div class="grid">
    <div
      v-for="inspection in inspections"
      :key="inspection.id"
      class="col-12 lg:col-6 flex"
    >
      <pv-card class="w-full flex flex-column justify-content-between shadow-2 border-round-lg hover:shadow-4 transition-duration-200">
        <template #header>
          <div class="p-4 surface-card border-bottom-1 surface-border flex justify-content-between align-items-center">
            <div>
              <div class="text-xs uppercase text-500 font-semibold tracking-wide">
                {{ inspection.machineryCode }}
              </div>
              <h3 class="m-0 text-xl font-bold text-900 mt-1">
                {{ inspection.machineryModelName || inspection.machineryCode }}
              </h3>
            </div>
            <pv-tag
              :value="getStatusLabel(inspection.status)"
              :severity="getStatusSeverity(inspection.status)"
              class="text-xs font-semibold px-2 py-1 uppercase"
            />
          </div>
        </template>

        <template #content>
          <div class="py-2">
            <!-- Pit Section Name -->
            <div class="flex align-items-center mb-3 text-700">
              <i class="pi pi-map-marker mr-2 text-primary text-lg" aria-hidden="true"></i>
              <span class="font-medium mr-2">{{ t('card-section') }}:</span>
              <span class="text-900 font-semibold">{{ inspection.pitSectionName }}</span>
            </div>

            <div class="flex flex-wrap gap-4 text-sm text-600 mb-3">
              <div v-if="inspection.inspectorName" class="flex align-items-center">
                <i class="pi pi-user mr-1 text-500" aria-hidden="true"></i>
                <span>{{ inspection.inspectorName }}</span>
              </div>
              <div v-if="inspection.inspectedAt" class="flex align-items-center">
                <i class="pi pi-calendar mr-1 text-500" aria-hidden="true"></i>
                <span>{{ inspection.inspectedAt }}</span>
              </div>
            </div>

            <pv-divider class="my-2" />

            <div class="mt-3">
              <div class="flex justify-content-between align-items-center mb-2">
                <span class="text-sm font-bold text-800 uppercase tracking-wide">
                  {{ t('card-readings-header') }}
                </span>
                <span v-if="inspection.hasTelemetry" class="text-xs text-500">
                  ({{ inspection.telemetryReadings.length }})
                </span>
              </div>

              <div v-if="inspection.hasTelemetry" class="flex flex-column gap-2">
                <div
                  v-for="(reading, idx) in inspection.telemetryReadings"
                  :key="reading.id || idx"
                  class="surface-ground p-3 border-round border-1 surface-border flex flex-wrap justify-content-between align-items-center gap-2"
                >
                  <div class="flex align-items-center gap-3">
                    <span class="text-xs font-bold text-500">#{{ idx + 1 }}</span>
                    <div>
                      <div class="text-xs text-600">{{ t('card-operating-hours') }}</div>
                      <div class="font-bold text-900 text-sm">
                        {{ formatHours(reading.operatingHours) }} {{ t('hours-unit') }}
                      </div>
                    </div>
                  </div>

                  <div class="flex align-items-center gap-3">
                    <div>
                      <div class="text-xs text-600">{{ t('card-engine-temp') }}</div>
                      <div class="font-semibold text-900 text-sm flex align-items-center">
                        <i class="pi pi-bolt mr-1 text-orange-500 text-xs" aria-hidden="true"></i>
                        {{ reading.engineTemperatureC }} {{ t('celsius-unit') }}
                      </div>
                    </div>

                    <div v-if="reading.oilPressurePsi">
                      <div class="text-xs text-600">{{ t('card-oil-pressure') }}</div>
                      <div class="font-semibold text-900 text-sm">
                        {{ reading.oilPressurePsi }} {{ t('psi-unit') }}
                      </div>
                    </div>
                  </div>

                  <div v-if="reading.alertTriggered">
                    <pv-tag
                      :value="t('card-alert-status')"
                      severity="danger"
                      icon="pi pi-exclamation-triangle"
                      class="text-xs"
                    />
                  </div>
                </div>
              </div>

              <div
                v-else
                class="surface-50 p-4 border-round border-dashed surface-border text-center my-2"
              >
                <i class="pi pi-inbox text-400 text-3xl mb-2" aria-hidden="true"></i>
                <div class="text-600 font-medium text-sm">
                  {{ t('card-no-telemetry') }}
                </div>
              </div>
            </div>

            <pv-message
              v-if="inspection.isCapacityExceeded"
              severity="warn"
              class="mt-3 text-xs"
              :closable="false"
            >
              {{ t('card-capacity-exceeded-warning') }}
            </pv-message>
          </div>
        </template>

        <template #footer>
          <div class="surface-ground p-3 border-round border-top-1 surface-border mt-3">
            <div class="grid m-0">
              <div class="col-6 p-2 border-right-1 surface-border">
                <div class="text-xs text-600 font-medium" :title="t('card-total-telemetry-tooltip')">
                  {{ t('card-total-telemetry') }}
                  <i class="pi pi-info-circle text-xs text-500 ml-1" aria-hidden="true"></i>
                </div>
                <div class="text-xl font-bold text-900 mt-1">
                  {{ formatHours(inspection.totalOperatingHours) }}
                  <span class="text-xs font-normal text-600">{{ t('hours-unit') }}</span>
                </div>
              </div>

              <div class="col-6 p-2 pl-3">
                <div class="text-xs text-600 font-medium">
                  {{ t('card-available-capacity') }}
                </div>
                <div
                  class="text-xl font-bold mt-1"
                  :class="{
                    'text-red-600': inspection.isCapacityExceeded || inspection.availableCapacity === 0,
                    'text-green-600': inspection.availableCapacity > 0
                  }"
                >
                  {{ formatHours(inspection.availableCapacity) }}
                  <span class="text-xs font-normal text-600">{{ t('hours-unit') }}</span>
                </div>
              </div>
            </div>

            <div v-if="inspection.maxOperatingHours" class="text-xs text-500 text-right mt-2 pr-1">
              {{ t('card-max-capacity') }}: {{ formatHours(inspection.maxOperatingHours) }} {{ t('hours-unit') }}
            </div>
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.tracking-wide {
  letter-spacing: 0.05em;
}
</style>
