/**
 * Capacity Domain Service. Encapsulates analytical calculations and business rules regarding machinery operating hours, total telemetry accumulation, available capacity, and capacity thresholds.
 *
 * @summary Domain service for equipment operating capacity analytics.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
export class CapacityService {
  /**
   * Calculates accumulated operating hours from a collection of telemetry readings using reduce().
   *
   * @param {Array<import('@/inspections/domain/model/telemetry-reading.entity.js').TelemetryReading>} readings - Telemetry list.
   * @returns {number} Total operating hours.
   */
  static calculateTotalOperatingHours(readings) {
    if (!Array.isArray(readings) || readings.length === 0) {
      return 0;
    }
    return readings.reduce((accumulator, reading) => {
      const hours = Number(reading?.operatingHours) || 0;
      return accumulator + hours;
    }, 0);
  }

  /**
   * Calculates the remaining available operating capacity.
   *
   * @param {number} maxOperatingHours
   * @param {number} totalOperatingHours
   * @returns {number}
   */
  static calculateAvailableCapacity(maxOperatingHours, totalOperatingHours) {
    const max = Number(maxOperatingHours) || 0;
    const total = Number(totalOperatingHours) || 0;
    return max - total;
  }

  /**
   * Validates whether a new telemetry reading can be accommodated within the available capacity.
   *
   * @param {number} availableCapacity
   * @param {number} newOperatingHours
   * @returns {{ isValid: boolean, message: string }}
   */
  static validateNewReadingCapacity(availableCapacity, newOperatingHours) {
    const requested = Number(newOperatingHours);
    const capacity = Number(availableCapacity);

    if (isNaN(requested) || requested < 0) {
      return {
        isValid: false,
        message: 'Operating hours must be a valid non-negative number.'
      };
    }

    if (capacity <= 0) {
      return {
        isValid: false,
        message: 'No operating capacity available for this inspection.'
      };
    }

    if (requested > capacity) {
      return {
        isValid: false,
        message: `Requested hours (${requested}) exceed available capacity (${capacity}).`
      };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Formats a numeric value using Intl.NumberFormat according to active locale.
   *
   * @param {number} value
   * @param {string} [locale='en-US']
   * @param {number} [maximumFractionDigits=2]
   * @returns {string} Formatted string.
   */
  static formatNumber(value, locale = 'en-US', maximumFractionDigits = 2) {
    const num = Number(value);
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits
    }).format(num);
  }
}

export default CapacityService;
