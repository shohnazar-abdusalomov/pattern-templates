export interface Database {
  insert(obj: unknown): boolean;
  update(obj: unknown): boolean;
  delete(obj: unknown): boolean;
  get(obj: unknown): unknown;
}
