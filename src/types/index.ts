export type ParamsType =
  | 'filters'
  | 'fields'
  | 'includes'
  | 'sort'
  | 'page'
  | 'limit'
  | 'appends';

export type QueryParams = {
  [key in ParamsType | string]: string;
};

export type ParserQuery<T extends Record<string, string | number>> = {
  append: KeyOfOrString<T>[];
  include: KeyOfOrString<T>[];
  fields: QueryFields;
  sorts: KeyOfOrString<T>[];
  filters: QueryFilters<T>;
  queryParams: QueryParams;
  model: string | null;
  paramsObj: Record<string, string> | null;
  pageNumber: number | null;
  limitNumber: number | null;
};

export type QueryOptions = {
  baseUrl?: string;
  queryParams?: QueryParams;
};

export type QueryFields =
  | {
      [key: string]: string;
    }
  | string;

export type QueryFilters<T extends Record<string, string | number>> = {
  [key in keyof T | string | number]: string;
};

export type KeyOfOrString<T extends Record<string, string | number>> =
  | keyof T
  | string;

export type KeyOfOrStringSort<T extends Record<string, string | number>> =
  | keyof T
  | SortLiteral<keyof T & string>
  | string;

type SortLiteral<K extends string> = K | `-${K}`;
