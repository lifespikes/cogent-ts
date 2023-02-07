import Query from './query';

export type QueryType = typeof Query.prototype;

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

export type QueryOptions = {
  baseUrl?: string;
  queryParams?: QueryParams;
};

export type QueryFields =
  | {
      [key: string]: string;
    }
  | string;

export type QueryFilters<K extends string | number | symbol> = {
  [key in K | string | number]: string;
};

export type KeyOfOrString<K extends string | number | symbol> = K | string;

export type ParseQuery<K extends string | number | symbol> = {
  append: KeyOfOrString<K>[];
  include: KeyOfOrString<K>[];
  fields: QueryFields;
  sorts: KeyOfOrString<K>[];
  filters: QueryFilters<K>;
  queryParams: QueryParams;
  model: string | null;
  paramsObj: Record<string, string> | null;
  pageNumber: number | null;
  limitNumber: number | null;
};
