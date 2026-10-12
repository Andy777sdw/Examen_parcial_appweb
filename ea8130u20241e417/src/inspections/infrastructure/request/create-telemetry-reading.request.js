/**
 * Create Telemetry Reading Request DTO. Formulates the validated payload required by the POST /telemetry-readings endpoint.
 *
 * @summary Request DTO for creating telemetry readings.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class CreateTelemetryReadingRequest {
  /**
   * Creates an instance of CreateTelemetryReadingRequest.
   *
   * @param {Object} params
   * @param {string} params.machineryCode
   * @param {number|string} params.modelId
   * @param {number|string} params.pitSectionId
   * @param {number} params.operatingHours
   * @param {number} params.engineTemperatureC
   * @param {number} params.oilPressurePsi
   * @param {boolean} [params.alertTriggered=false]
   * @param {string} [params.registeredAt]
   */
  constructor({
    machineryCode,
    modelId,
    pitSectionId,
    operatingHours,
    engineTemperatureC,
    oilPressurePsi,
    alertTriggered = false,
    registeredAt
  }) {
    this.machineryCode = String(machineryCode || '').trim();
    this.modelId = Number(modelId);
    this.pitSectionId = Number(pitSectionId);
    this.operatingHours = Number(operatingHours);
    this.engineTemperatureC = Number(engineTemperatureC);
    this.oilPressurePsi = Number(oilPressurePsi);
    this.alertTriggered = Boolean(alertTriggered);
    this.registeredAt = registeredAt || new Date().toISOString();
  }

  /**
   * Serializes the request to plain JSON object suitable for the API.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      machineryCode: this.machineryCode,
      modelId: this.modelId,
      pitSectionId: this.pitSectionId,
      operatingHours: this.operatingHours,
      engineTemperatureC: this.engineTemperatureC,
      oilPressurePsi: this.oilPressurePsi,
      alertTriggered: this.alertTriggered,
      registeredAt: this.registeredAt
    };
  }
}
