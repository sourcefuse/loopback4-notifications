import {Credentials} from '../credentials';
export interface EC2MetadataCredentials extends Credentials {
  /**
   * Creates credentials from the metadata service on an EC2 instance.
   * @param {object} options - Override the default (1s) timeout period.
   */
}
interface EC2MetadataCredentialsOptions {
  httpOptions?: {
    /**
     * Timeout in milliseconds.
     */
    timeout?: number;
    /**
     * Connection timeout in milliseconds.
     */
    connectTimeout?: number;
  };
  maxRetries?: number;
}
