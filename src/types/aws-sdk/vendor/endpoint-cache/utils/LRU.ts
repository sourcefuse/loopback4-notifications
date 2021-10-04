export interface LRUCache<T> {
  headerNode: unknown;
  tailNode: unknown;
  nodeMap: unknown;
  size: unknown;
  readonly sizeLimit: unknown;
  readonly length: number;
  prependToList: unknown;
  removeFromTail: unknown;
  detachFromList: unknown;
  get(key: string): T | undefined;
  remove(key: string): void;
  put(key: string, value: T): void;
  empty(): void;
}
