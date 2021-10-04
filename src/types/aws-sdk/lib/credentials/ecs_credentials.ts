import {RemoteCredentials} from './remote_credentials';
export interface ECSCredentials extends RemoteCredentials {
  /**
   * Represents credentials received.
   * @param {object} options - Override the default (1s) timeout period.
   */
}
interface ECSCredentialsOptions {
  httpOptions?: {
    /**
     * Timeout in milliseconds.
     */
    timeout?: number;
  };
  maxRetries?: number;
}
