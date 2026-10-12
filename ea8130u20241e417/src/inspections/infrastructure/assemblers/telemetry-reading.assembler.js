/**
 * Telemetry Reading Assembler. Converts raw backend telemetry records into TelemetryReading domain entities.
 *
 * @summary Assembler for TelemetryReading domain entities.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { TelemetryReading } from '@/inspections/domain/model/telemetry-reading.entity.js';

export class TelemetryReadingAssembler {
  /**
   * Transforms a raw backend telemetry record into a TelemetryReading entity.
   *
   * @param {Object} raw
   * @returns {TelemetryReading}
   */
  static toEntity(raw) {
    if (!raw) return null;
    return new TelemetryReading({
      id: raw.id,
      machineryCode: raw.machineryCode,
      modelId: raw.modelId,
      pitSectionId: raw.pitSectionId,
      operatingHours: raw.operatingHours,
      engineTemperatureC: raw.engineTemperatureC,
      oilPressurePsi: raw.oilPressurePsi,
      alertTriggered: raw.alertTriggered,
      registeredAt: raw.registeredAt,
      inspectionRecordId: raw.inspectionRecordId
    });
  }

  /**
   * Transforms a collection of raw backend telemetry records into TelemetryReading entities.
   *
   * @param {Array<Object>} rawList
   * @returns {Array<TelemetryReading>}
   */
  static toEntities(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(raw => TelemetryReadingAssembler.toEntity(raw)).filter(Boolean);
  }
}
