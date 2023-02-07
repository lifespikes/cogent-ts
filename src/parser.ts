import { ParserQuery } from './types';
import qs from 'qs';

export default class Parser<
  T extends Record<string, string>,
  K extends keyof T
> {
  query: ParserQuery<T, K>;
  uri: string;

  constructor(query: ParserQuery<T, K>) {
    this.query = query;
    this.uri = '';
  }

  parse() {
    this.includes();
    this.appends();
    this.fields();
    this.filters();
    this.sorts();
    this.params();
    this.page();
    this.limit();

    return this.uri;
  }

  prepend() {
    return this.uri === '' ? '?' : '&';
  }

  includes() {
    if (this.query.include.length === 0) {
      return;
    }

    this.uri += `${this.prepend() + this.query.queryParams.includes}=${
      this.query.include
    }`;
  }

  appends() {
    if (this.query.append.length === 0) {
      return;
    }

    this.uri += `${this.prepend() + this.query.queryParams.appends}=${
      this.query.append
    }`;
  }

  fields() {
    if (Object.keys(this.query.fields).length === 0) {
      return;
    }

    const fields = {
      [`${this.query.queryParams.fields}[${this.query.model}]`]: this.query
        .fields,
    };

    this.uri += this.prepend() + qs.stringify(fields, { encode: false });
  }

  filters() {
    if (Object.keys(this.query.filters).length === 0) {
      return;
    }

    const filters = {
      [this.query.queryParams.filters]: this.query.filters,
    };

    this.uri += this.prepend() + qs.stringify(filters, { encode: false });
  }

  sorts() {
    if (this.query.sorts.length === 0) {
      return;
    }

    this.uri += `${this.prepend() + this.query.queryParams.sort}=${
      this.query.sorts
    }`;
  }

  page() {
    if (this.query.pageNumber === null) {
      return;
    }

    this.uri += `${this.prepend() + this.query.queryParams.page}=${
      this.query.pageNumber
    }`;
  }

  limit() {
    if (this.query.limitNumber === null) {
      return;
    }

    this.uri += `${this.prepend() + this.query.queryParams.limit}=${
      this.query.limitNumber
    }`;
  }

  params() {
    if (this.query.paramsObj === null) {
      return;
    }

    this.uri +=
      this.prepend() + qs.stringify(this.query.paramsObj, { encode: false });
  }
}
