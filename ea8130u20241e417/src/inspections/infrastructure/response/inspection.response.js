/**
 * Inspection Response DTO. Models the raw response structure returned by the /inspection-records endpoint.
 *
 * @summary Response DTO for raw inspection records.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class InspectionResponse {
  /**
   * Creates an instance of InspectionResponse.
   *
   * @param {Object} raw
   */
  constructor(raw = {}) {
    this.id = raw.id;
    this.machineryCode = raw.machineryCode;
    this.pitSectionId = raw.pitSectionId;
    this.inspectorName = raw.inspectorName;
    this.status = raw.status;
    this.notes = raw.notes;
    this.inspectedAt = raw.inspectedAt;
    this.maxOperatingHours = raw.maxOperatingHours;
    this.modelId = raw.modelId;
    this.operatingHours = raw.operatingHours;
  }
}
