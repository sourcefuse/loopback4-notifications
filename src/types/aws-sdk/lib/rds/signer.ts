import {Credentials, CredentialsOptions} from '../credentials';
import {AWSError} from '../error';
export interface Signer {
  /**
   * A signer object can be used to generate an auth token to a database.
   */
  /**
   * Generate an auth token to a database.
   */
  getAuthToken(
    options: Signer.SignerOptions,
    callback: (err: AWSError, token: string) => void,
  ): void;
  /**
   * Generate an auth token to a database.
   */
  getAuthToken(options: Signer.SignerOptions): string;
}

namespace Signer {
  export interface SignerOptions {
    credentials?: Credentials | CredentialsOptions;
    region?: string;
    hostname?: string;
    port?: number;
    username?: string;
  }
}
