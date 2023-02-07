import {
  KeyOfOrString,
  QueryFields,
  QueryFilters,
  QueryOptions,
  QueryParams,
} from './types';
import Parser from './parser';

export default class Query<
  T,
  K extends string | number | symbol = keyof T | string
> {
  private readonly baseUrl: QueryOptions['baseUrl'];
  private model: string | null = null;
  private readonly queryParams: QueryParams;
  private include: KeyOfOrString<K>[] = [];
  private append: KeyOfOrString<K>[] = [];
  private sorts: KeyOfOrString<K>[] = [];
  private fields: QueryFields = {};
  private filters: QueryFilters<K> = {} as QueryFilters<K>;
  private pageNumber: number | null = null;
  private limitNumber: number | null = null;
  private paramsObj: Record<string, string> | null = null;

  constructor(options?: QueryOptions) {
    this.baseUrl = options?.baseUrl || undefined;

    this.queryParams = {
      filters: 'filter',
      fields: 'fields',
      includes: 'include',
      appends: 'append',
      page: 'page',
      limit: 'limit',
      sort: 'sort',
      ...options?.queryParams,
    };
  }

  forModel(model: string) {
    this.model = model;

    return this;
  }

  private parser() {
    return new Parser<K>({
      filters: this.filters,
      fields: this.fields,
      include: this.include,
      append: this.append,
      queryParams: this.queryParams,
      sorts: this.sorts,
      paramsObj: this.paramsObj,
      model: this.model,
      pageNumber: this.pageNumber,
      limitNumber: this.limitNumber,
    });
  }

  get() {
    const url = this.parseQuery();

    this.reset();
    return url;
  }

  private reset() {
    this.parser().uri = '';
  }

  private getBaseUrl() {
    if (!this.baseUrl && !this.model) {
      throw new Error(
        'A base url or model must be provided before building the query.'
      );
    }

    if (this.model && this.baseUrl) {
      return `${this.baseUrl}/${this.model}`;
    }

    if (this.model) {
      return `/${this.model}`;
    }

    const model = this.baseUrl?.split('/').at(-1);

    const baseUrlWithOutLastSlash = this.baseUrl
      ?.split('/')
      .slice(0, -1)
      .join('/');

    return `${baseUrlWithOutLastSlash}/${model}`;
  }

  private parseQuery() {
    return this.getBaseUrl() + this.parser().parse();
  }

  includes(include: KeyOfOrString<K>[]) {
    this.include = include;

    return this;
  }

  appends(append: KeyOfOrString<K>[]) {
    this.append = append;

    return this;
  }

  select(fields: KeyOfOrString<K>[] | Record<string, string[]>) {
    if (Array.isArray(fields)) {
      this.fields = fields.join(',');

      return this;
    }

    Object.entries(fields).forEach(([key, value]) => {
      this.fields = {
        ...(this.fields as Record<string, string>),
        [key]: value.join(','),
      };
    });

    return this;
  }

  where(key: K, value: string) {
    this.filters[key] = value;

    return this;
  }

  whereIn(key: K | number, array: string[]) {
    this.filters[key] = array.join(',');

    return this;
  }

  sort(sorts: K[]) {
    this.sorts = sorts;

    return this;
  }

  page(pageNumber: number) {
    this.pageNumber = pageNumber;

    return this;
  }

  limit(value: number) {
    this.limitNumber = value;

    return this;
  }

  params(params: Record<string, string>) {
    this.paramsObj = params;

    return this;
  }
}
