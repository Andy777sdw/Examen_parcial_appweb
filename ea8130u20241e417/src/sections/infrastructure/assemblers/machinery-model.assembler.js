/**
 * Converts raw machinery model API response objects into MachineryModel domain entities.
 *
 * @summary Assembler for MachineryModel entities.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { MachineryModel } from '@/sections/domain/model/machinery-model.entity.js';

export class MachineryModelAssembler {
  /**
   * Transforms a raw API record into a MachineryModel entity.
   *
   * @param {Object} raw
   * @returns {MachineryModel}
   */
  static toEntity(raw) {
    if (!raw) return null;
    return new MachineryModel({
      id: raw.id,
      modelName: raw.modelName,
      manufacturer: raw.manufacturer,
      idSection: raw.idSection
    });
  }

  /**
   * Transforms a collection of raw API records into MachineryModel entities.
   *
   * @param {Array<Object>} rawList
   * @returns {Array<MachineryModel>}
   */
  static toEntities(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(raw => MachineryModelAssembler.toEntity(raw)).filter(Boolean);
  }
}
