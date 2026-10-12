/**
 * Telemetry Reading Response DTO.
 *
 * @summary Response DTO for raw telemetry readings.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class TelemetryReadingResponse {
  /**
   * Creates an instance of TelemetryReadingResponse.
   *
   * @param {Object} raw - Raw API response item.
   */
  constructor(raw = {}) {
    this.id = raw.id;
    this.machineryCode = raw.machineryCode;
    this.modelId = raw.modelId;
    this.pitSectionId = raw.pitSectionId;
    this.operatingHours = raw.operatingHours;
    this.engineTemperatureC = raw.engineTemperatureC;
    this.oilPressurePsi = raw.oilPressurePsi;
    this.alertTriggered = raw.alertTriggered;
    this.registeredAt = raw.registeredAt;
    this.inspectionRecordId = raw.inspectionRecordId;
  }
}
