/**
 * Represents an equipment model manufactured for mining operations.
 *
 * @summary Domain entity representing a heavy machinery model.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class MachineryModel {
  /**
   * Creates an instance of MachineryModel.
   *
   * @param {Object} params
   * @param {number|string} params.id
   * @param {string} params.modelName
   * @param {string} params.manufacturer
   * @param {number|string} params.idSection
   */
  constructor({ id, modelName, manufacturer, idSection }) {
    this.id = id !== undefined && id !== null ? Number(id) : null;
    this.modelName = modelName || '';
    this.manufacturer = manufacturer || '';
    this.idSection = idSection !== undefined && idSection !== null ? Number(idSection) : null;
  }

  /**
   * Returns a displayable label combining manufacturer and model name.
   *
   * @returns {string}*/
  get displayLabel() {
    return this.manufacturer ? `${this.manufacturer} - ${this.modelName}` : this.modelName;
  }
}
