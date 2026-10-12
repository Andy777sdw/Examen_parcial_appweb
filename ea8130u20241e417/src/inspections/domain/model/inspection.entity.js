/**
 * Inspection domain entity. Represents an inspection record conducted on heavy mining machinery.
 *
 * @summary Domain entity representing a machinery inspection.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class Inspection {
  /**
   * Creates an instance of Inspection.
   *
   * @param {Object} params
   * @param {number|string} params.id
   * @param {string} params.machineryCode
   * @param {number|string} params.pitSectionId
   * @param {string} params.inspectorName
   * @param {string} params.status
   * @param {string} [params.notes='']
   * @param {string} [params.inspectedAt='']
   * @param {number} [params.maxOperatingHours=0]
   * @param {number|string} [params.modelId=null]
   * @param {number} [params.operatingHours=0]
   */
  constructor({
    id,
    machineryCode,
    pitSectionId,
    inspectorName,
    status,
    notes = '',
    inspectedAt = '',
    maxOperatingHours = 0,
    modelId = null,
    operatingHours = 0
  }) {
    this.id = id !== undefined && id !== null ? Number(id) : null;
    this.machineryCode = machineryCode || '';
    this.pitSectionId = pitSectionId !== undefined && pitSectionId !== null ? Number(pitSectionId) : null;
    this.inspectorName = inspectorName || '';
    this.status = status || 'OPERATIONAL';
    this.notes = notes || '';
    this.inspectedAt = inspectedAt || '';
    this.maxOperatingHours = Number(maxOperatingHours) || 0;
    this.modelId = modelId !== undefined && modelId !== null ? Number(modelId) : null;
    this.operatingHours = Number(operatingHours) || 0;

    // Presentation & joined attributes
    this.pitSectionName = '';
    this.machineryModelName = '';
    this.telemetryReadings = [];
  }

  /**
   * Calculates the total accumulated operating hours from associated telemetry readings using reduce().
   *
   * @returns {number}
   */
  get totalOperatingHours() {
    if (!this.telemetryReadings || this.telemetryReadings.length === 0) {
      return 0;
    }
    return this.telemetryReadings.reduce((sum, r) => sum + (Number(r.operatingHours) || 0), 0);
  }

  /**
   * Calculates the remaining available operating capacity.
   * Formula: availableCapacity = maxOperatingHours - totalOperatingHours
   *
   * @returns {number}
   */
  get availableCapacity() {
    return this.maxOperatingHours - this.totalOperatingHours;
  }

  /**
   * Determines whether the accumulated operating hours exceed maximum capacity.
   *
   * @returns {boolean}
   */
  get isCapacityExceeded() {
    return this.availableCapacity < 0;
  }

  /**
   * Determines whether no additional telemetry capacity is available.
   *
   * @returns {boolean}
   */
  get isFullCapacity() {
    return this.availableCapacity <= 0;
  }

  /**
   * Returns whether there is any associated telemetry reading.
   *
   * @returns {boolean}
   */
  get hasTelemetry() {
    return Array.isArray(this.telemetryReadings) && this.telemetryReadings.length > 0;
  }
}
