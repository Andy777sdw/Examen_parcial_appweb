/**
 * Inspection API client. Handles HTTP requests to the local JSON Server inspection-records endpoint.
 *
 * @summary Infrastructure API client for inspections.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { httpClient } from '@/shared/infrastructure/http/http-client.js';

export class InspectionApi {
  /**
   * Creates an instance of InspectionApi.
   *
   * @param {string} [resourceEndpoint='/inspection-records']
   */
  constructor(resourceEndpoint = '/inspection-records') {
    this.endpoint = resourceEndpoint;
  }

  /**
   * Retrieves all inspection records from the backend.
   *
   * @returns {Promise<Array<Object>>}
   */
  async getAll() {
    const response = await httpClient.get(this.endpoint);
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Retrieves a single inspection record by ID.
   *
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    const response = await httpClient.get(`${this.endpoint}/${id}`);
    return response.data;
  }
}

export default new InspectionApi();
