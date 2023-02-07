import Query from './query';
import { QueryOptions } from './types';

export const queryBuilder = <T>(baseOptions?: QueryOptions) => {
  return (options?: QueryOptions) =>
    new Query<T>({ ...baseOptions, ...options });
};

export { Query };
