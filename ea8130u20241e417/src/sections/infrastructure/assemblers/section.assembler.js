/**
 * Section Assembler.
 *
 * @summary Assembler for Section entities.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { Section } from '@/sections/domain/model/section.entity.js';

export class SectionAssembler {
  /**
   * Transforms a raw API record into a Section entity.
   *
   * @param {Object} raw
   * @returns {Section}
   */
  static toEntity(raw) {
    if (!raw) return null;
    return new Section({
      id: raw.id,
      name: raw.name,
      maxOperatingHours: raw.maxOperatingHours
    });
  }

  /**
   * Transforms a collection of raw API records into Section entities.
   *
   * @param {Array<Object>} rawList
   * @returns {Array<Section>}
   */
  static toEntities(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(raw => SectionAssembler.toEntity(raw)).filter(Boolean);
  }
}
