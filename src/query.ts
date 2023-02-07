import {
  KeyOfOrString,
  KeyOfOrStringSort,
  QueryFields,
  QueryFilters,
  QueryOptions,
  QueryParams,
} from './types';
import Parser from './parser';

export default class Query<T extends Record<string, string | number>> {
  private readonly baseUrl: QueryOptions['baseUrl'];
  private model: string | null = null;
  private readonly queryParams: QueryParams;
  private include: KeyOfOrString<T>[] = [];
  private append: KeyOfOrString<T>[] = [];
  private sorts: KeyOfOrString<T>[] = [];
  private fields: QueryFields = {};
  private filters: QueryFilters<T> = {} as QueryFilters<T>;
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
    return new Parser<T>({
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

  includes(include: KeyOfOrString<T>[]) {
    this.include = include;

    return this;
  }

  appends(append: KeyOfOrString<T>[]) {
    this.append = append;

    return this;
  }

  select(fields: KeyOfOrString<T>[] | Record<string, string[]>) {
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

  where(key: KeyOfOrString<T>, value: string) {
    this.filters[key] = value;

    return this;
  }

  whereIn(key: KeyOfOrString<T>, array: string[]) {
    this.filters[key] = array.join(',');

    return this;
  }

  sort(sorts: KeyOfOrStringSort<T>[]) {
    this.sorts = sorts;

    return this;
  }

  orderBy(sorts: KeyOfOrStringSort<T>[]) {
    return this.sort(sorts);
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
