/**
 * Section API client.
 *
 * @summary Infrastructure API client for pit sections.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { externalHttpClient } from '@/shared/infrastructure/http/http-client.js';

export class SectionApi {
  /**
   * Creates an instance of SectionApi.
   *
   * @param {string} [apiUrl]
   */
  constructor(apiUrl) {
    this.apiUrl =
      apiUrl ||
      import.meta.env.VITE_PIT_SECTIONS_API_URL ||
      'https://gist.githubusercontent.com/ovillafuerte/aee81192da8fe9df3a11e4b27f07e8f7/raw/4d96caf25d747d1463d9c997e03330b52e6005d4/pit-sections';
  }

  /**
   * Fetches all pit sections from the remote catalog.
   *
   * @returns {Promise<Array<Object>>} Raw list of pit section items.*/
  async getAll() {
    const response = await externalHttpClient.get(this.apiUrl);
    return Array.isArray(response.data) ? response.data : [];
  }
}

export default new SectionApi();
