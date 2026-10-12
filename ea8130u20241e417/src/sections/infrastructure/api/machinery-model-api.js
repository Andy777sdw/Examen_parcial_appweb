/**
 * Communicates with the external machinery models catalog API.
 *
 * @summary Infrastructure API client for machinery models.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import { externalHttpClient } from '@/shared/infrastructure/http/http-client.js';

export class MachineryModelApi {
  /**
   * Creates an instance of MachineryModelApi.
   *
   * @param {string} [apiUrl]
   */
  constructor(apiUrl) {
    this.apiUrl =
      apiUrl ||
      import.meta.env.VITE_MACHINERY_MODELS_API_URL ||
      'https://gist.githubusercontent.com/ovillafuerte/bb42d462214465c70b3472a10e23c558/raw/06083af1287c749e219bb650e05700274d020c09/machinery-models.json';
  }

  /**
   * Fetches all machinery models from the remote catalog.
   *
   * @returns {Promise<Array<Object>>} Raw list of machinery model items.*/
  async getAll() {
    const response = await externalHttpClient.get(this.apiUrl);
    return Array.isArray(response.data) ? response.data : [];
  }
}

export default new MachineryModelApi();
