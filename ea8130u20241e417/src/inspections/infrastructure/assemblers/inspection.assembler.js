/**
 * Inspection Assembler. Converts raw inspection data or response DTOs into Inspection domain entities.
 *
 * @summary Assembler for Inspection domain entities.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { Inspection } from '@/inspections/domain/model/inspection.entity.js';

export class InspectionAssembler {
  /**
   * Transforms a raw backend inspection record into an Inspection domain entity.
   *
   * @param {Object} raw
   * @returns {Inspection}
   */
  static toEntity(raw) {
    if (!raw) return null;
    return new Inspection({
      id: raw.id,
      machineryCode: raw.machineryCode,
      pitSectionId: raw.pitSectionId,
      inspectorName: raw.inspectorName,
      status: raw.status,
      notes: raw.notes,
      inspectedAt: raw.inspectedAt,
      maxOperatingHours: raw.maxOperatingHours,
      modelId: raw.modelId,
      operatingHours: raw.operatingHours
    });
  }

  /**
   * Transforms a collection of raw backend inspection records into Inspection domain entities.
   *
   * @param {Array<Object>} rawList
   * @returns {Array<Inspection>}
   */
  static toEntities(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(raw => InspectionAssembler.toEntity(raw)).filter(Boolean);
  }
}
