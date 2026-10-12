/**
 * Inspection Pinia Store. Manages reactive state for inspections, telemetry readings, capacity calculations, and handles real-time submission with server re-validation.
 *
 * @summary Pinia store for inspections and telemetry.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { defineStore } from 'pinia';
import inspectionService from '@/inspections/application/services/inspection.service.js';
import telemetryReadingService from '@/inspections/application/services/telemetry-reading.service.js';
import { CapacityService } from '@/inspections/domain/services/capacity.service.js';
import { CreateTelemetryReadingRequest } from '@/inspections/infrastructure/request/create-telemetry-reading.request.js';
import { useSectionStore } from '@/sections/stores/section.store.js';

export const useInspectionStore = defineStore('inspections', {
  state: () => ({
    inspections: [],
    telemetryReadings: [],
    loading: false,
    error: null,
    submitting: false
  }),

  getters: {
    /**
     * Finds an inspection by ID.
     */
    getInspectionById: (state) => (id) => {
      if (id === undefined || id === null) return null;
      return state.inspections.find(ins => Number(ins.id) === Number(id)) || null;
    },

    /**
     * Filters inspections located within a given pit section.
     */
    getInspectionsBySectionId: (state) => (sectionId) => {
      if (sectionId === undefined || sectionId === null) return [];
      return state.inspections.filter(ins => Number(ins.pitSectionId) === Number(sectionId));
    },

    /**
     * Returns inspections that still have positive operating capacity.
     */
    getEligibleInspectionsForSection: (state) => (sectionId) => {
      if (sectionId === undefined || sectionId === null) return [];
      return state.inspections.filter(
        ins => Number(ins.pitSectionId) === Number(sectionId) && ins.availableCapacity > 0
      );
    }
  },

  actions: {
    /**
     * Fetches all inspection data, telemetry readings, and catalog data, performing joins.
     */
    async loadAllData() {
      this.loading = true;
      this.error = null;
      try {
        const sectionStore = useSectionStore();
        if (sectionStore.sections.length === 0 || sectionStore.machineryModels.length === 0) {
          await sectionStore.fetchAll();
        }

        const [rawInspections, rawReadings] = await Promise.all([
          inspectionService.getInspections(),
          telemetryReadingService.getReadings()
        ]);

        this.telemetryReadings = rawReadings;

        const enriched = inspectionService.joinInspectionData(
          rawInspections,
          rawReadings,
          sectionStore.sections,
          sectionStore.machineryModels
        );

        this.inspections = enriched;
      } catch (err) {
        this.error = err.message || 'Failed to load inspections and telemetry readings';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Creates a new telemetry reading with fresh server-side capacity validation.
     *
     * @param {Object} formData
     * @returns {Promise<import('@/inspections/domain/model/telemetry-reading.entity.js').TelemetryReading>} Created reading.
     */
    async createTelemetryReading(formData) {
      this.submitting = true;
      this.error = null;
      try {
        const sectionStore = useSectionStore();
        if (sectionStore.sections.length === 0 || sectionStore.machineryModels.length === 0) {
          await sectionStore.fetchAll();
        }

        const [freshInspections, freshReadings] = await Promise.all([
          inspectionService.getInspections(),
          telemetryReadingService.getReadings()
        ]);

        const enrichedFresh = inspectionService.joinInspectionData(
          freshInspections,
          freshReadings,
          sectionStore.sections,
          sectionStore.machineryModels
        );

        const targetInspection = enrichedFresh.find(
          ins =>
            ins.machineryCode.trim().toUpperCase() === String(formData.machineryCode).trim().toUpperCase() &&
            Number(ins.pitSectionId) === Number(formData.pitSectionId)
        );

        if (!targetInspection) {
          throw new Error(`Inspection not found for machinery code ${formData.machineryCode}.`);
        }

        const requestedHours = Number(formData.operatingHours);
        const capacityCheck = CapacityService.validateNewReadingCapacity(
          targetInspection.availableCapacity,
          requestedHours
        );

        if (!capacityCheck.isValid) {
          throw new Error(capacityCheck.message);
        }

        const requestDto = new CreateTelemetryReadingRequest({
          machineryCode: targetInspection.machineryCode,
          modelId: formData.modelId || targetInspection.modelId,
          pitSectionId: targetInspection.pitSectionId,
          operatingHours: requestedHours,
          engineTemperatureC: formData.engineTemperatureC,
          oilPressurePsi: formData.oilPressurePsi,
          alertTriggered: Boolean(formData.alertTriggered),
          registeredAt: new Date().toISOString()
        });

        const created = await telemetryReadingService.createReading(requestDto);

        await this.loadAllData();

        return created;
      } catch (err) {
        this.error = err.message || 'Error creating telemetry reading';
        throw err;
      } finally {
        this.submitting = false;
      }
    }
  }
});
