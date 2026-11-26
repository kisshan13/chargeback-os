import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { BaseRecord } from "../schema.js";

export type CollectionInput<T extends BaseRecord> = readonly T[] | string | URL;
export type QueryPredicate<T> = (record: T) => boolean;

export interface FieldOperators<T> {
  equals?: T;
  notEquals?: T;
  in?: readonly T[];
  notIn?: readonly T[];
  isNull?: boolean;
  contains?: T extends string ? string : never;
  startsWith?: T extends string ? string : never;
  endsWith?: T extends string ? string : never;
  greaterThan?: T extends number | string ? T : never;
  greaterThanOrEqual?: T extends number | string ? T : never;
  lessThan?: T extends number | string ? T : never;
  lessThanOrEqual?: T extends number | string ? T : never;
}

export type FieldFilter<T> = T | FieldOperators<NonNullable<T>>;
export type EntityFilter<T extends BaseRecord> = { [K in keyof T]?: FieldFilter<T[K]> } & {
  AND?: readonly EntityFilter<T>[];
  OR?: readonly EntityFilter<T>[];
  NOT?: EntityFilter<T>;
};

export interface SortSpec<T extends BaseRecord, K extends keyof T = keyof T> {
  field: K;
  direction?: "asc" | "desc";
  compare?: (left: T[K], right: T[K]) => number;
}

export interface QueryOptions<T extends BaseRecord> {
  where?: EntityFilter<T> | QueryPredicate<T>;
  orderBy?: SortSpec<T> | readonly SortSpec<T>[];
  offset?: number;
  limit?: number;
}

export interface CollectionInfo {
  readonly entityName: string;
  readonly source: "array" | "file";
}

export class SyntheticRecordNotFoundError extends Error {
  constructor(entityName: string, id: string) {
    super(`${entityName} record with id "${id}" was not found.`);
    this.name = "SyntheticRecordNotFoundError";
  }
}

export class SyntheticDataFileError extends Error {
  constructor(filePath: string, message: string) {
    super(`Unable to load synthetic data file "${filePath}": ${message}`);
    this.name = "SyntheticDataFileError";
  }
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
function sourcePath(source: string | URL): string { return source instanceof URL ? fileURLToPath(source) : source; }
function sameValue(left: unknown, right: unknown): boolean {
  return Object.is(left, right) || (Array.isArray(left) && Array.isArray(right) && JSON.stringify(left) === JSON.stringify(right));
}
function isOperatorObject(value: unknown): value is FieldOperators<unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return ["equals", "notEquals", "in", "notIn", "isNull", "contains", "startsWith", "endsWith", "greaterThan", "greaterThanOrEqual", "lessThan", "lessThanOrEqual"]
    .some((key) => Object.prototype.hasOwnProperty.call(value, key));
}
function matchesOperators<T>(actual: T, operators: FieldOperators<T>): boolean {
  if (operators.isNull !== undefined && (actual === null) !== operators.isNull) return false;
  if (operators.equals !== undefined && !sameValue(actual, operators.equals)) return false;
  if (operators.notEquals !== undefined && sameValue(actual, operators.notEquals)) return false;
  if (operators.in && !operators.in.some((value) => sameValue(actual, value))) return false;
  if (operators.notIn && operators.notIn.some((value) => sameValue(actual, value))) return false;
  if (operators.contains !== undefined && (typeof actual !== "string" || !actual.includes(String(operators.contains)))) return false;
  if (operators.startsWith !== undefined && (typeof actual !== "string" || !actual.startsWith(String(operators.startsWith)))) return false;
  if (operators.endsWith !== undefined && (typeof actual !== "string" || !actual.endsWith(String(operators.endsWith)))) return false;
  if (operators.greaterThan !== undefined && compareValues(actual, operators.greaterThan) <= 0) return false;
  if (operators.greaterThanOrEqual !== undefined && compareValues(actual, operators.greaterThanOrEqual) < 0) return false;
  if (operators.lessThan !== undefined && compareValues(actual, operators.lessThan) >= 0) return false;
  if (operators.lessThanOrEqual !== undefined && compareValues(actual, operators.lessThanOrEqual) > 0) return false;
  return true;
}
function matchesFilter<T extends BaseRecord>(record: T, filter: EntityFilter<T>): boolean {
  if (filter.AND && !filter.AND.every((child) => matchesFilter(record, child))) return false;
  if (filter.OR && filter.OR.length > 0 && !filter.OR.some((child) => matchesFilter(record, child))) return false;
  if (filter.NOT && matchesFilter(record, filter.NOT)) return false;
  for (const [field, condition] of Object.entries(filter)) {
    if (field === "AND" || field === "OR" || field === "NOT") continue;
    const actual = record[field as keyof T];
    if (isOperatorObject(condition) ? !matchesOperators(actual, condition) : !sameValue(actual, condition)) return false;
  }
  return true;
}
function compareValues(left: unknown, right: unknown): number {
  if (sameValue(left, right)) return 0;
  if (left === null || left === undefined) return -1;
  if (right === null || right === undefined) return 1;
  return left < right ? -1 : 1;
}
function parseJsonl<T extends BaseRecord>(filePath: string): T[] {
  let contents: string;
  try { contents = readFileSync(filePath, "utf8"); }
  catch (error) { throw new SyntheticDataFileError(filePath, error instanceof Error ? error.message : "file could not be read"); }
  return contents.split(/\r?\n/).flatMap((line, index) => {
    if (!line.trim()) return [];
    let parsed: unknown;
    try { parsed = JSON.parse(line); }
    catch { throw new SyntheticDataFileError(filePath, `invalid JSON at line ${index + 1}`); }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || typeof (parsed as { id?: unknown }).id !== "string") {
      throw new SyntheticDataFileError(filePath, `line ${index + 1} must be an object with a string id`);
    }
    return [parsed as T];
  });
}

/** Read-only typed operations over one in-memory JSONL entity collection. */
export abstract class SyntheticCollection<T extends BaseRecord> {
  private readonly records: readonly T[];
  public readonly info: CollectionInfo;
  protected constructor(input: CollectionInput<T> = [], entityName: string) {
    this.records = Object.freeze(Array.isArray(input) ? input.map((record) => clone(record)) : parseJsonl<T>(sourcePath(input as string | URL)));
    this.info = { entityName, source: Array.isArray(input) ? "array" : "file" };
  }
  get length(): number { return this.records.length; }
  count(options?: QueryOptions<T>): number { return this.findMany(options).length; }
  all(): T[] { return this.records.map((record) => clone(record)); }
  at(index: number): T | undefined { const record = this.records[index]; return record ? clone(record) : undefined; }
  findById(id: string): T | undefined { const record = this.records.find((candidate) => candidate.id === id); return record ? clone(record) : undefined; }
  requireById(id: string): T { const record = this.findById(id); if (!record) throw new SyntheticRecordNotFoundError(this.info.entityName, id); return record; }
  findByIds(ids: readonly string[]): T[] { const wanted = new Set(ids); return this.records.filter((record) => wanted.has(record.id)).map((record) => clone(record)); }
  exists(options: QueryOptions<T> = {}): boolean { return this.findFirst(options) !== undefined; }
  findFirst(options: QueryOptions<T> = {}): T | undefined { return this.findMany({ ...options, limit: 1 })[0]; }
  findMany(options: QueryOptions<T> = {}): T[] {
    const predicate = typeof options.where === "function" ? options.where : options.where ? (record: T) => matchesFilter(record, options.where as EntityFilter<T>) : () => true;
    let results = this.records.filter(predicate);
    const sort = options.orderBy ? (Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy]) : [];
    if (sort.length) results = [...results].sort((left, right) => {
      for (const spec of sort) {
        const field = spec.field as keyof T;
        const leftValue = Reflect.get(left, field as PropertyKey) as T[keyof T];
        const rightValue = Reflect.get(right, field as PropertyKey) as T[keyof T];
        const comparison = spec.compare ? spec.compare(leftValue, rightValue) : compareValues(leftValue, rightValue);
        if (comparison) return spec.direction === "desc" ? -comparison : comparison;
      }
      return 0;
    });
    const offset = options.offset ?? 0;
    if (!Number.isInteger(offset) || offset < 0) throw new RangeError("Query offset must be a non-negative integer.");
    if (options.limit !== undefined && (!Number.isInteger(options.limit) || options.limit < 0)) throw new RangeError("Query limit must be a non-negative integer.");
    return results.slice(offset, options.limit === undefined ? undefined : offset + options.limit).map((record) => clone(record));
  }
  where(filter: EntityFilter<T> | QueryPredicate<T>): T[] { return this.findMany({ where: filter }); }
  pluck<K extends keyof T>(field: K, options?: QueryOptions<T>): Array<T[K]> { return this.findMany(options).map((record) => record[field]); }
  distinct<K extends keyof T>(field: K, options?: QueryOptions<T>): Array<T[K]> {
    const values: T[K][] = [];
    for (const value of this.pluck(field, options)) if (!values.some((existing) => sameValue(existing, value))) values.push(value);
    return values;
  }
  groupBy<K extends keyof T>(field: K, options?: QueryOptions<T>): Map<T[K], T[]> {
    const groups = new Map<T[K], T[]>();
    for (const record of this.findMany(options)) groups.set(record[field], [...(groups.get(record[field]) ?? []), record]);
    return groups;
  }
  toJSONL(options?: QueryOptions<T>): string {
    const records = this.findMany(options);
    return records.length ? `${records.map((record) => JSON.stringify(record)).join("\n")}\n` : "";
  }
}
