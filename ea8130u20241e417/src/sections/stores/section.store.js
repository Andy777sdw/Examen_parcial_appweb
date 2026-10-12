/**
 * Sections & Machinery Models Pinia Store. Manages global state for mining sections and equipment models.
 *
 * @summary Pinia store for pit sections and machinery models.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { defineStore } from 'pinia';
import sectionService from '@/sections/application/services/section.service.js';
import machineryModelService from '@/sections/application/services/machinery-model.service.js';

export const useSectionStore = defineStore('sections', {
  state: () => ({
    sections: [],
    machineryModels: [],
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Finds a section by its ID (normalizing string/number comparison).
     */
    getSectionById: (state) => (id) => {
      if (id === undefined || id === null) return null;
      return state.sections.find(s => Number(s.id) === Number(id)) || null;
    },

    /**
     * Finds a machinery model by its ID.
     */
    getModelById: (state) => (id) => {
      if (id === undefined || id === null) return null;
      return state.machineryModels.find(m => Number(m.id) === Number(id)) || null;
    },

    /**
     * Filters machinery models associated with a specific section.
     */
    getModelsBySectionId: (state) => (sectionId) => {
      if (sectionId === undefined || sectionId === null) return [];
      return state.machineryModels.filter(m => Number(m.idSection) === Number(sectionId));
    }
  },

  actions: {
    /**
     * Loads pit sections from the remote catalog API.
     */
    async fetchSections() {
      try {
        const data = await sectionService.getSections();
        this.sections = data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch sections';
        throw err;
      }
    },

    /**
     * Loads machinery models from the remote catalog API.
     */
    async fetchMachineryModels() {
      try {
        const data = await machineryModelService.getModels();
        this.machineryModels = data;
      } catch (err) {
        this.error = err.message || 'Failed to fetch machinery models';
        throw err;
      }
    },

    /**
     * Loads both sections and machinery models concurrently.
     */
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        await Promise.all([this.fetchSections(), this.fetchMachineryModels()]);
      } catch (err) {
        this.error = err.message || 'Failed to fetch catalog data';
      } finally {
        this.loading = false;
      }
    }
  }
});
