import {Credentials} from '../credentials';
export interface RemoteCredentials extends Credentials {
  /**
   * Represents credentials received.
   * @param {object} options - Override the default (1s) timeout period.
   */
}
interface RemoteCredentialsOptions {
  httpOptions?: {
    /**
     * Timeout in milliseconds.
     */
    timeout?: number;
  };
  maxRetries?: number;
}
