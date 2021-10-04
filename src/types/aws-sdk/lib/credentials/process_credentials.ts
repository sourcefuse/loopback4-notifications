import {HTTPOptions} from '../config-base';
import {Credentials} from '../credentials';
export interface ProcessCredentials extends Credentials {
  /**
   * Creates a new ProcessCredentials object.
   */
}

interface ProcessCredentialsOptions {
  profile?: string;
  filename?: string;
  httpOptions?: HTTPOptions;
}
