/**
 * Section Application Service.
 *
 * @summary Application service for section domain operations.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { SectionApi } from '@/sections/infrastructure/api/section-api.js';
import { SectionAssembler } from '@/sections/infrastructure/assemblers/section.assembler.js';

export class SectionService {
  /**
   * Creates an instance of SectionService.
   *
   * @param {SectionApi} [api]
   */
  constructor(api = new SectionApi()) {
    this.api = api;
  }

  /**
   * Retrieves all pit sections transformed into domain entities.
   *
   * @returns {Promise<Array<import('@/sections/domain/model/section.entity.js').Section>>}
   */
  async getSections() {
    const rawData = await this.api.getAll();
    return SectionAssembler.toEntities(rawData);
  }
}

export default new SectionService();
