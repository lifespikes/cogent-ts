import Query from './query';
import { QueryOptions } from './types';

export function queryBuilder<
  T extends Record<string, string>,
  K extends keyof T = keyof T
>(baseOptions: QueryOptions) {
  return (options: QueryOptions) =>
    new Query<T, K>({ ...baseOptions, ...options });
}

export { Query };
