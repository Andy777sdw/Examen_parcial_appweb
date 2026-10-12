/**
 * Telemetry Reading API client. Handles HTTP requests to the local JSON Server telemetry-readings endpoint.
 *
 * @summary Infrastructure API client for telemetry readings.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { httpClient } from '@/shared/infrastructure/http/http-client.js';

export class TelemetryReadingApi {
  /**
   * Creates an instance of TelemetryReadingApi.
   *
   * @param {string} [resourceEndpoint='/telemetry-readings']
   */
  constructor(resourceEndpoint = '/telemetry-readings') {
    this.endpoint = resourceEndpoint;
  }

  /**
   * Retrieves all telemetry readings from the backend.
   *
   * @returns {Promise<Array<Object>>}
   */
  async getAll() {
    const response = await httpClient.get(this.endpoint);
    return Array.isArray(response.data) ? response.data : [];
  }

  /**
   * Creates a new telemetry reading record.
   *
   * @param {Object} payload
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const response = await httpClient.post(this.endpoint, payload);
    return response.data;
  }
}

export default new TelemetryReadingApi();
