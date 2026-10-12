/**
 * Inspection Application Service.
 * Coordinates retrieval of inspections, joins inspection data with external pit sections and machinery models catalogs, and associates telemetry readings.
 *
 * @summary Application service for inspection bounded context.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { InspectionApi } from '@/inspections/infrastructure/api/inspection-api.js';
import { InspectionAssembler } from '@/inspections/infrastructure/assemblers/inspection.assembler.js';

export class InspectionService {
  /**
   * Creates an instance of InspectionService.
   *
   * @param {InspectionApi} [api]
   */
  constructor(api = new InspectionApi()) {
    this.api = api;
  }

  /**
   * Fetches all inspection domain entities from the API.
   *
   * @returns {Promise<Array<import('@/inspections/domain/model/inspection.entity.js').Inspection>>}
   */
  async getInspections() {
    const rawData = await this.api.getAll();
    return InspectionAssembler.toEntities(rawData);
  }

  /**
   * Joins inspections with catalog sections, machinery models, and associated telemetry readings.
   *
   * @param {Array<import('@/inspections/domain/model/inspection.entity.js').Inspection>} inspections
   * @param {Array<import('@/inspections/domain/model/telemetry-reading.entity.js').TelemetryReading>} telemetryReadings
   * @param {Array<import('@/sections/domain/model/section.entity.js').Section>} sections
   * @param {Array<import('@/sections/domain/model/machinery-model.entity.js').MachineryModel>} machineryModels
   * @returns {Array<import('@/inspections/domain/model/inspection.entity.js').Inspection>}
   */
  joinInspectionData(inspections, telemetryReadings, sections, machineryModels) {
    if (!Array.isArray(inspections)) return [];
    const readings = Array.isArray(telemetryReadings) ? telemetryReadings : [];
    const secList = Array.isArray(sections) ? sections : [];
    const modelList = Array.isArray(machineryModels) ? machineryModels : [];

    return inspections.map(inspection => {
      // 1. Join with Pit Section: inspection.pitSectionId with section.id
      const section = secList.find(s => Number(s.id) === Number(inspection.pitSectionId));
      if (section) {
        inspection.pitSectionName = section.name;
        // Fallback maxOperatingHours from section if not explicitly defined on inspection
        if (!inspection.maxOperatingHours && section.maxOperatingHours) {
          inspection.maxOperatingHours = section.maxOperatingHours;
        }
      } else {
        inspection.pitSectionName = `Section #${inspection.pitSectionId}`;
      }

      // 2. Associate telemetry readings with inspection
      const associatedReadings = readings.filter(reading => {
        // Direct link if present
        if (reading.inspectionRecordId !== null && Number(reading.inspectionRecordId) === Number(inspection.id)) {
          return true;
        }
        // Match by equipment code and section identifier
        const codeMatches =
          reading.machineryCode &&
          inspection.machineryCode &&
          reading.machineryCode.trim().toUpperCase() === inspection.machineryCode.trim().toUpperCase();

        if (codeMatches) {
          if (reading.pitSectionId !== null && inspection.pitSectionId !== null) {
            return Number(reading.pitSectionId) === Number(inspection.pitSectionId);
          }
          return true;
        }
        return false;
      });

      // 3. Enrich associated telemetry readings with catalog model and section names
      associatedReadings.forEach(reading => {
        // telemetry.modelId with machineryModel.id
        const model = modelList.find(m => Number(m.id) === Number(reading.modelId));
        if (model) {
          reading.machineryModelName = model.modelName;
        }
        // telemetry.pitSectionId with section.id
        const readingSec = secList.find(s => Number(s.id) === Number(reading.pitSectionId));
        if (readingSec) {
          reading.pitSectionName = readingSec.name;
        } else {
          reading.pitSectionName = inspection.pitSectionName;
        }
      });

      inspection.telemetryReadings = associatedReadings;

      // 4. Resolve machinery model name for the inspection card header
      let model = null;
      if (inspection.modelId) {
        model = modelList.find(m => Number(m.id) === Number(inspection.modelId));
      } else if (associatedReadings.length > 0 && associatedReadings[0].modelId) {
        model = modelList.find(m => Number(m.id) === Number(associatedReadings[0].modelId));
      }

      if (model) {
        inspection.machineryModelName = model.modelName;
        if (!inspection.modelId) {
          inspection.modelId = model.id;
        }
      } else {
        inspection.machineryModelName = inspection.machineryCode;
      }

      return inspection;
    });
  }
}

export default new InspectionService();
