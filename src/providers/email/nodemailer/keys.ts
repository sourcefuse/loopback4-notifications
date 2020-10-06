import {BindingKey} from '@loopback/core';
import SMTPTransport = require('nodemailer/lib/smtp-transport');

export namespace NodemailerBindings {
  /**
   * A sample config looks like
   * pool: true,
   *  maxConnections: 100,
   *  url:"",
   *  host: "smtp.example.com",
   *  port: 80,
   *  secure: false,
   *  auth: {
   *   user: "username",
   *   pass: "password"
   *  },
   *  tls: {
   *    // do not fail on invalid certs
   *    rejectUnauthorized: true
   *   }
   */
  export const Config = BindingKey.create<SMTPTransport.Options | null>(
    'sf.notification.config.nodemailer',
  );
}
