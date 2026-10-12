<script setup>
/**
 * New Telemetry View. Provides the interactive creation form for registering a new telemetry reading with dynamic section and machinery filtering, accessible validations, and strict real-time capacity compliance checking.
 *
 * @summary View for registering a new telemetry reading.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useSectionStore } from '@/sections/stores/section.store.js';
import { useInspectionStore } from '@/inspections/stores/inspection.store.js';
import { CapacityService } from '@/inspections/domain/services/capacity.service.js';

const router = useRouter();
const { t, locale } = useI18n();
const toast = useToast();

const sectionStore = useSectionStore();
const inspectionStore = useInspectionStore();

// Form state
const form = reactive({
  sectionId: null,
  inspectionId: null,
  machineryCode: '',
  modelId: null,
  operatingHours: null,
  engineTemperatureC: null,
  oilPressurePsi: null,
  alertTriggered: false
});

// Validation errors state
const errors = reactive({
  sectionId: '',
  inspectionId: '',
  operatingHours: '',
  engineTemperatureC: '',
  oilPressurePsi: '',
  general: ''
});

const isSubmitting = ref(false);

onMounted(async () => {
  await Promise.all([
    sectionStore.fetchAll(),
    inspectionStore.loadAllData()
  ]);
});

// Eligible inspections for the selected section
const availableInspectionsForSection = computed(() => {
  if (!form.sectionId) return [];
  return inspectionStore.inspections.filter(
    ins => Number(ins.pitSectionId) === Number(form.sectionId)
  );
});

// Currently selected inspection object
const selectedInspection = computed(() => {
  if (!form.inspectionId) return null;
  return inspectionStore.inspections.find(ins => Number(ins.id) === Number(form.inspectionId)) || null;
});

// Watch section change to clear dependent inputs
watch(
  () => form.sectionId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      form.inspectionId = null;
      form.machineryCode = '';
      form.modelId = null;
      errors.inspectionId = '';
      errors.operatingHours = '';
      errors.general = '';
    }
  }
);

// Watch inspection change to populate equipment details
watch(
  () => form.inspectionId,
  (newId) => {
    errors.inspectionId = '';
    errors.operatingHours = '';
    errors.general = '';

    if (newId) {
      const target = inspectionStore.inspections.find(i => Number(i.id) === Number(newId));
      if (target) {
        form.machineryCode = target.machineryCode;
        form.modelId = target.modelId;
      }
    } else {
      form.machineryCode = '';
      form.modelId = null;
    }
  }
);

// Validate form fields
function validate() {
  let isValid = true;
  errors.sectionId = '';
  errors.inspectionId = '';
  errors.operatingHours = '';
  errors.engineTemperatureC = '';
  errors.oilPressurePsi = '';
  errors.general = '';

  if (!form.sectionId) {
    errors.sectionId = t('validation-section-required');
    isValid = false;
  }

  if (!form.inspectionId || !selectedInspection.value) {
    errors.inspectionId = t('validation-inspection-required');
    isValid = false;
  }

  // Operating hours validation
  if (form.operatingHours === null || form.operatingHours === undefined || isNaN(form.operatingHours)) {
    errors.operatingHours = t('validation-operating-hours-required');
    isValid = false;
  } else if (Number(form.operatingHours) <= 0) {
    errors.operatingHours = t('validation-operating-hours-positive');
    isValid = false;
  } else if (selectedInspection.value) {
    const available = selectedInspection.value.availableCapacity;
    if (Number(form.operatingHours) > available) {
      errors.operatingHours = t('validation-operating-hours-capacity', {
        hours: form.operatingHours,
        capacity: available
      });
      isValid = false;
    }
  }

  // Engine temperature validation
  if (form.engineTemperatureC === null || form.engineTemperatureC === undefined || isNaN(form.engineTemperatureC)) {
    errors.engineTemperatureC = t('validation-engine-temp-required');
    isValid = false;
  }

  // Oil pressure validation
  if (form.oilPressurePsi === null || form.oilPressurePsi === undefined || isNaN(form.oilPressurePsi)) {
    errors.oilPressurePsi = t('validation-oil-pressure-required');
    isValid = false;
  } else if (Number(form.oilPressurePsi) < 0) {
    errors.oilPressurePsi = t('validation-oil-pressure-required');
    isValid = false;
  }

  return isValid;
}

// Handle form submission
async function handleSubmit() {
  if (isSubmitting.value) return;

  if (!validate()) {
    return;
  }

  isSubmitting.value = true;
  errors.general = '';

  try {
    await inspectionStore.createTelemetryReading({
      pitSectionId: form.sectionId,
      inspectionId: form.inspectionId,
      machineryCode: form.machineryCode,
      modelId: form.modelId,
      operatingHours: form.operatingHours,
      engineTemperatureC: form.engineTemperatureC,
      oilPressurePsi: form.oilPressurePsi,
      alertTriggered: form.alertTriggered
    });

    toast.add({
      severity: 'success',
      summary: t('toast-success-title'),
      detail: t('toast-success-detail'),
      life: 3000
    });

    // Navigate to /home on success
    router.push('/home');
  } catch (err) {
    const message = err.message || t('toast-error-detail');
    errors.general = message;
    toast.add({
      severity: 'error',
      summary: t('toast-error-title'),
      detail: message,
      life: 5000
    });
  } finally {
    isSubmitting.value = false;
  }
}

// Cancel action
function handleCancel() {
  router.push('/home');
}

function formatNumber(num) {
  return CapacityService.formatNumber(num, locale.value, 1);
}
</script>

<template>
  <div class="p-4 md:p-6 max-w-4xl mx-auto">
    <!-- View Header -->
    <header class="mb-5 pb-3 border-bottom-1 surface-border">
      <h1 class="text-3xl font-bold text-900 m-0">
        {{ t('new-telemetry-title') }}
      </h1>
      <p class="text-lg text-600 m-0 mt-2 font-medium">
        {{ t('new-telemetry-subtitle') }}
      </p>
    </header>

    <!-- General Error Banner -->
    <pv-message
      v-if="errors.general"
      severity="error"
      class="mb-4"
      :closable="true"
      @close="errors.general = ''"
    >
      {{ errors.general }}
    </pv-message>

    <!-- Form Card -->
    <pv-card class="shadow-2 border-round-lg">
      <template #content>
        <form @submit.prevent="handleSubmit" novalidate class="flex flex-column gap-4">
          <!-- Step 1: Mining Section -->
          <div class="field flex flex-column gap-2">
            <label for="section-select" class="font-bold text-900">
              {{ t('form-section') }} <span class="text-red-500">*</span>
            </label>
            <pv-select
              id="section-select"
              v-model="form.sectionId"
              :options="sectionStore.sections"
              optionLabel="name"
              optionValue="id"
              :placeholder="t('form-section-placeholder')"
              :loading="sectionStore.loading"
              class="w-full"
              :class="{ 'p-invalid': errors.sectionId }"
              aria-describedby="section-error"
            />
            <small v-if="errors.sectionId" id="section-error" class="text-red-600 font-medium">
              {{ errors.sectionId }}
            </small>
          </div>

          <!-- Step 2: Inspection / Machinery Selection -->
          <div class="field flex flex-column gap-2">
            <label for="inspection-select" class="font-bold text-900">
              {{ t('form-inspection') }} <span class="text-red-500">*</span>
            </label>
            <pv-select
              id="inspection-select"
              v-model="form.inspectionId"
              :options="availableInspectionsForSection"
              :placeholder="t('form-inspection-placeholder')"
              :disabled="!form.sectionId || availableInspectionsForSection.length === 0"
              class="w-full"
              :class="{ 'p-invalid': errors.inspectionId }"
              aria-describedby="inspection-error"
            >
              <template #option="slotProps">
                <div class="flex justify-content-between align-items-center w-full py-1">
                  <div>
                    <span class="font-bold text-900 mr-2">{{ slotProps.option.machineryCode }}</span>
                    <span class="text-600 text-sm">({{ slotProps.option.machineryModelName }})</span>
                  </div>
                  <pv-tag
                    :value="`${formatNumber(slotProps.option.availableCapacity)} ${t('hours-unit')}`"
                    :severity="slotProps.option.availableCapacity > 0 ? 'success' : 'danger'"
                    class="text-xs"
                  />
                </div>
              </template>
              <template #value="slotProps">
                <span v-if="slotProps.value">
                  {{ selectedInspection?.machineryCode }} — {{ selectedInspection?.machineryModelName }}
                </span>
                <span v-else class="text-500">
                  {{ t('form-inspection-placeholder') }}
                </span>
              </template>
            </pv-select>
            <small v-if="errors.inspectionId" id="inspection-error" class="text-red-600 font-medium">
              {{ errors.inspectionId }}
            </small>
            <small
              v-else-if="form.sectionId && availableInspectionsForSection.length === 0"
              class="text-orange-600 font-medium"
            >
              {{ t('form-no-eligible-inspections') }}
            </small>
          </div>

          <div
            v-if="selectedInspection"
            class="surface-ground p-3 border-round border-1 surface-border"
          >
            <div class="grid m-0 align-items-center">
              <div class="col-12 md:col-6">
                <div class="text-xs text-600 uppercase font-semibold">
                  {{ t('form-machinery-code') }}
                </div>
                <div class="text-lg font-bold text-900 mt-1">
                  {{ selectedInspection.machineryCode }}
                  <span class="text-sm font-normal text-600">({{ selectedInspection.machineryModelName }})</span>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="text-xs text-600 uppercase font-semibold">
                  {{ t('form-current-capacity') }}
                </div>
                <div
                  class="text-xl font-bold mt-1"
                  :class="selectedInspection.availableCapacity > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatNumber(selectedInspection.availableCapacity) }} {{ t('hours-unit') }}
                  <span class="text-xs font-normal text-500">
                    / {{ formatNumber(selectedInspection.maxOperatingHours) }} {{ t('hours-unit') }} max
                  </span>
                </div>
              </div>
            </div>

            <pv-message
              v-if="selectedInspection.availableCapacity <= 0"
              severity="error"
              class="mt-3 text-xs"
              :closable="false"
            >
              {{ t('card-capacity-full-warning') }}
            </pv-message>
          </div>

          <pv-divider class="my-2" />

          <!-- Step 3: Numeric Metrics Grid -->
          <div class="grid">
            <!-- Operating Hours -->
            <div class="col-12 md:col-4 field flex flex-column gap-2">
              <label for="hours-input" class="font-bold text-900">
                {{ t('form-operating-hours') }} <span class="text-red-500">*</span>
              </label>
              <pv-input-number
                id="hours-input"
                v-model="form.operatingHours"
                :min="0"
                :maxFractionDigits="1"
                :placeholder="t('form-operating-hours-placeholder')"
                class="w-full"
                :class="{ 'p-invalid': errors.operatingHours }"
                aria-describedby="hours-error"
              />
              <small v-if="errors.operatingHours" id="hours-error" class="text-red-600 font-medium">
                {{ errors.operatingHours }}
              </small>
            </div>

            <!-- Engine Temperature -->
            <div class="col-12 md:col-4 field flex flex-column gap-2">
              <label for="temp-input" class="font-bold text-900">
                {{ t('form-engine-temp') }} <span class="text-red-500">*</span>
              </label>
              <pv-input-number
                id="temp-input"
                v-model="form.engineTemperatureC"
                :minFractionDigits="1"
                :maxFractionDigits="2"
                :placeholder="t('form-engine-temp-placeholder')"
                class="w-full"
                :class="{ 'p-invalid': errors.engineTemperatureC }"
                aria-describedby="temp-error"
              />
              <small v-if="errors.engineTemperatureC" id="temp-error" class="text-red-600 font-medium">
                {{ errors.engineTemperatureC }}
              </small>
            </div>

            <!-- Oil Pressure -->
            <div class="col-12 md:col-4 field flex flex-column gap-2">
              <label for="pressure-input" class="font-bold text-900">
                {{ t('form-oil-pressure') }} <span class="text-red-500">*</span>
              </label>
              <pv-input-number
                id="pressure-input"
                v-model="form.oilPressurePsi"
                :min="0"
                :minFractionDigits="1"
                :maxFractionDigits="2"
                :placeholder="t('form-oil-pressure-placeholder')"
                class="w-full"
                :class="{ 'p-invalid': errors.oilPressurePsi }"
                aria-describedby="pressure-error"
              />
              <small v-if="errors.oilPressurePsi" id="pressure-error" class="text-red-600 font-medium">
                {{ errors.oilPressurePsi }}
              </small>
            </div>
          </div>

          <!-- Step 4: Alert Triggered Boolean Switch -->
          <div class="field flex align-items-center gap-3 pt-2">
            <pv-toggle-switch
              id="alert-switch"
              v-model="form.alertTriggered"
              aria-label="Alert Triggered toggle"
            />
            <label for="alert-switch" class="font-bold text-900 cursor-pointer">
              {{ t('form-alert-triggered') }}
            </label>
            <pv-tag
              v-if="form.alertTriggered"
              value="ACTIVE ALERT"
              severity="danger"
              class="text-xs ml-2"
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-content-end gap-3 pt-4 border-top-1 surface-border">
            <pv-button
              type="button"
              :label="t('btn-cancel')"
              class="p-button-outlined p-button-secondary px-4"
              :disabled="isSubmitting"
              @click="handleCancel"
            />
            <pv-button
              type="submit"
              :label="isSubmitting ? t('btn-submitting') : t('btn-create')"
              icon="pi pi-check"
              class="p-button-primary px-5"
              :loading="isSubmitting"
              :disabled="selectedInspection && selectedInspection.availableCapacity <= 0"
            />
          </div>
        </form>
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.max-w-4xl {
  max-width: 56rem;
}
</style>
