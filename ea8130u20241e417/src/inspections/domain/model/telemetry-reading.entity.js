/**
 * TelemetryReading domain entity. Represents an individual sensor reading and operating metric captured from mining equipment.
 *
 * @summary Domain entity representing a telemetry reading.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class TelemetryReading {
  /**
   * Creates an instance of TelemetryReading.
   *
   * @param {Object} params
   * @param {number|string} params.id
   * @param {string} params.machineryCode
   * @param {number|string} params.modelId
   * @param {number|string} params.pitSectionId
   * @param {number} [params.operatingHours=0]
   * @param {number} [params.engineTemperatureC=0]
   * @param {number} [params.oilPressurePsi=0]
   * @param {boolean} [params.alertTriggered=false]
   * @param {string} [params.registeredAt='']
   * @param {number|string} [params.inspectionRecordId=null]
   */
  constructor({
    id,
    machineryCode,
    modelId,
    pitSectionId,
    operatingHours = 0,
    engineTemperatureC = 0,
    oilPressurePsi = 0,
    alertTriggered = false,
    registeredAt = '',
    inspectionRecordId = null
  }) {
    this.id = id !== undefined && id !== null ? Number(id) : null;
    this.machineryCode = machineryCode || '';
    this.modelId = modelId !== undefined && modelId !== null ? Number(modelId) : null;
    this.pitSectionId = pitSectionId !== undefined && pitSectionId !== null ? Number(pitSectionId) : null;
    this.operatingHours = Number(operatingHours) || 0;
    this.engineTemperatureC = Number(engineTemperatureC) || 0;
    this.oilPressurePsi = Number(oilPressurePsi) || 0;
    this.alertTriggered = Boolean(alertTriggered);
    this.registeredAt = registeredAt || '';
    this.inspectionRecordId =
      inspectionRecordId !== undefined && inspectionRecordId !== null
        ? Number(inspectionRecordId)
        : null;

    // Presentation helpers
    this.machineryModelName = '';
    this.pitSectionName = '';
  }

  /**
   * Returns a formatted ISO or localized date string.
   *
   * @returns {string}
   */
  get formattedRegisteredAt() {
    if (!this.registeredAt) return '';
    try {
      const date = new Date(this.registeredAt);
      return date.toLocaleString();
    } catch {
      return this.registeredAt;
    }
  }
}