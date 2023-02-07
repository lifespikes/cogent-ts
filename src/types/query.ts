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

export type ParserQuery<T extends Record<string, string | number>, K extends keyof T> = {
  append: KeyOfOrString<T, K>[];
  include: KeyOfOrString<T, K>[];
  fields: QueryFields;
  sorts: KeyOfOrString<T, K>[];
  filters: QueryFilters<T, K>;
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

export type QueryFilters<
  T extends Record<string, string | number>,
  K extends keyof T
> = {
  [key in K | string | number]: string;
};

export type KeyOfOrString<
  T extends Record<string, string | number>,
  K extends keyof T
> = K | string;

export type KeyOfOrStringSort<
  T extends Record<string, string | number>,
  K extends keyof T = keyof T | string
// eslint-disable-next-line prettier/prettier
> = K | `-${K extends string ? K : string}` | string;
