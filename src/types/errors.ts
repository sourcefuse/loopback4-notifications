export class AwsImportError extends Error {
  constructor() {
    super();
    this.message =
      'Cannot use Amazon SES service!\n' +
      'Please install aws-sdk before using this service.\n' +
      'Run `npm install --save aws-sdk` to install AWS SDK.';
  }
}

export class PubnubImportError extends Error {
  constructor() {
    super();
    this.message =
      'Cannot use PubNub service!\n' +
      'Please install pubnub before using this service.\n' +
      'Run `npm install --save pubnub` to install AWS SDK.';
  }
}
