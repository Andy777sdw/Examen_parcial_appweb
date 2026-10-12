/**
 * Telemetry Reading Application Service. Coordinates retrieval, creation, and assembly of telemetry sensor readings.
 *
 * @summary Application service for telemetry operations.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { TelemetryReadingApi } from '@/inspections/infrastructure/api/telemetry-reading-api.js';
import { TelemetryReadingAssembler } from '@/inspections/infrastructure/assemblers/telemetry-reading.assembler.js';

export class TelemetryReadingService {
  /**
   * Creates an instance of TelemetryReadingService.
   *
   * @param {TelemetryReadingApi} [api]
   */
  constructor(api = new TelemetryReadingApi()) {
    this.api = api;
  }

  /**
   * Fetches all telemetry readings as domain entities.
   *
   * @returns {Promise<Array<import('@/inspections/domain/model/telemetry-reading.entity.js').TelemetryReading>>}
   */
  async getReadings() {
    const rawData = await this.api.getAll();
    return TelemetryReadingAssembler.toEntities(rawData);
  }

  /**
   * Submits and creates a new telemetry reading.
   *
   * @param {import('@/inspections/infrastructure/request/create-telemetry-reading.request.js').CreateTelemetryReadingRequest|Object} request
   * @returns {Promise<import('@/inspections/domain/model/telemetry-reading.entity.js').TelemetryReading>}
   */
  async createReading(request) {
    const payload = typeof request.toJSON === 'function' ? request.toJSON() : request;
    const rawResult = await this.api.create(payload);
    return TelemetryReadingAssembler.toEntity(rawResult);
  }
}

export default new TelemetryReadingService();
