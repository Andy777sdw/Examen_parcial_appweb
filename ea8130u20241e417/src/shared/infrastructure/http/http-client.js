/**
 * Configures and provides Axios instances for internal backend and external catalog APIs.
 *
 * @summary Shared HTTP infrastructure client.
 * @author Andy Alfredo Hipolito Salcedo Muñoz
 */
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Shared Axios instance for local JSON Server backend.
 */
export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 10000
});

/**
 * Shared Axios instance for external API requests.
 */
export const externalHttpClient = axios.create({
  headers: {
    Accept: 'application/json'
  },
  timeout: 10000
});

export default httpClient;
