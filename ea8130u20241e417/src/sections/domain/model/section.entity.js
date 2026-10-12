/**
 * Section domain entity.
 *
 * @summary Domain entity representing a pit section.
 * @author Alfredo Hipolito Salcedo Muñoz
 */
export class Section {
  /**
   * Creates an instance of Section.
   *
   * @param {Object} params
   * @param {number|string} params.id
   * @param {string} params.name
   * @param {number} [params.maxOperatingHours=0]
   */
  constructor({ id, name, maxOperatingHours = 0 }) {
    this.id = id !== undefined && id !== null ? Number(id) : null;
    this.name = name || '';
    this.maxOperatingHours = Number(maxOperatingHours) || 0;
  }

  /**
   * Returns a displayable label combining id and name.
   *
   * @returns {string} */
  get displayLabel() {
    return this.name || `Section #${this.id}`;
  }
}
