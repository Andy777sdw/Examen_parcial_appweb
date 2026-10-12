/**
 * Machinery Model Application Service. Coordinates retrieval and querying of heavy machinery models.
 *
 * @summary Application service for machinery model domain operations.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { MachineryModelApi } from '@/sections/infrastructure/api/machinery-model-api.js';
import { MachineryModelAssembler } from '@/sections/infrastructure/assemblers/machinery-model.assembler.js';

export class MachineryModelService {
  /**
   * Creates an instance of MachineryModelService.
   *
   * @param {MachineryModelApi} [api] - Injected Machinery Model API client.
   */
  constructor(api = new MachineryModelApi()) {
    this.api = api;
  }

  /**
   * Retrieves all machinery models transformed into domain entities.
   *
   * @returns {Promise<Array<import('@/sections/domain/model/machinery-model.entity.js').MachineryModel>>}
   */
  async getModels() {
    const rawData = await this.api.getAll();
    return MachineryModelAssembler.toEntities(rawData);
  }
}

export default new MachineryModelService();
