// Cloudflare Worker and D1/R2 type declarations for TypeScript compilation

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
  meta?: any;
}

interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec<T = unknown>(query: string): Promise<D1Result<T>>;
}

interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: any;
  customMetadata?: Record<string, string>;
}

interface R2Bucket {
  head(key: string): Promise<R2Object | null>;
  get(key: string, options?: any): Promise<any>;
  put(key: string, value: any, options?: any): Promise<R2Object>;
  delete(keys: string | string[]): Promise<void>;
  list(options?: any): Promise<any>;
}

interface CloudflareEnv {
  DB: D1Database;
  PRIVATE_BUCKET: R2Bucket;
  PUBLIC_BUCKET: R2Bucket;
}
