/**
 * Output shape for endpoint discovery operations
 */
export type DiscoveredEndpoints = Array<{
  Address?: string;
  CachePeriodInMinutes?: number;
}>;
type EndpointRecords = Array<{
  Address: string;
  Expire: number;
}>;
export interface EndpointIdentifier {
  [key: string]: string | undefined;
  serviceId?: string;
  region?: string;
  accessKeyId?: string;
  operation?: string;
}
export interface EndpointCache {
  readonly maxSize: number;
  cache: unknown;
  readonly size: number;
  put(key: EndpointIdentifier | string, value: DiscoveredEndpoints): void;
  get(key: EndpointIdentifier | string): EndpointRecords | undefined;
  getKeyString(key: EndpointIdentifier): string;
  populateValue: unknown;
  empty(): void;
  remove(key: EndpointIdentifier | string): void;
}
