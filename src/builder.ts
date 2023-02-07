import Query from './query';
import { QueryOptions } from './types';

export function queryBuilder<T extends Record<string, string | number>>(baseOptions?: QueryOptions) {
  return (options?: QueryOptions) => new Query<T>({ ...baseOptions, ...options });
}

export { Query };
