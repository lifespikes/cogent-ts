import { queryBuilder } from '../src';

describe('Query Builder', () => {
  it('returns the base url if defined', () => {
    const builder = queryBuilder({
      baseUrl: 'https://example.com',
    });

    expect(builder().get()).toEqual('https://example.com');
  });

  it('can override query names depending on config', () => {
    const builder = queryBuilder({
      queryParams: {
        includes: 'includes',
        fields: 'select',
      },
    });
    const query = builder()
      .forModel('pizza')
      .includes(['toppings'])
      .select(['name'])
      .get();
    const expected = '/pizza?includes=toppings&select[pizza]=name';

    expect(query).toEqual(expected);
  });

  it('can prepend an url', () => {
    const builder = queryBuilder({
      baseUrl: 'https://example.com',
    });
    const expected = 'https://example.com/pizza?include=toppings';
    const query = builder()
      .forModel('pizza')
      .includes(['toppings'])
      .get();

    expect(query).toEqual(expected);
  });

  test('throws an error if forModel() and baseUrl are not defined', () => {
    expect.assertions(1);
    try {
      const builder = queryBuilder();

      builder()
        .includes(['toppings'])
        .get();
    } catch (error) {
      expect((error as any).message as string).toBe(
        'A base url or model must be provided before building the query.'
      );
    }
  });

  it('builds a simple query with appends()', () => {
    const builder = queryBuilder();
    const expected = '/pizza?append=full_name,rating';
    const query = builder()
      .forModel('pizza')
      .appends(['full_name', 'rating'])
      .get();

    expect(query).toEqual(expected);
  });

  it('builds a simple query with includes()', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .includes(['toppings'])
      .get();
    const expected = '/pizza?include=toppings';

    expect(query).toEqual(expected);
  });

  it('builds a simple query with where()', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .where('topping', 'cheese')
      .get();
    const expected = '/pizza?filter[topping]=cheese';

    expect(query).toEqual(expected);
  });

  it('builds a simple query with whereIn()', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .whereIn('topping', ['beef', 'cheese'])
      .get();
    const expected = '/pizza?filter[topping]=beef,cheese';

    expect(query).toEqual(expected);
  });

  it('builds a simple query with select()', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .select(['name', 'date_added'])
      .get();
    const expected = '/pizza?fields[pizza]=name,date_added';

    expect(query).toEqual(expected);
  });

  it('can limit the query', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .where('name', 'meatlovers')
      .limit(5)
      .get();
    const expected = '/pizza?filter[name]=meatlovers&limit=5';

    expect(query).toEqual(expected);
  });

  test('can paginate the query', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .limit(5)
      .page(2)
      .get();
    const expected = '/pizza?page=2&limit=5';

    expect(query).toEqual(expected);
  });

  test('it can sort the query', () => {
    const builder = queryBuilder();

    const query = builder()
      .forModel('pizza')
      .sort(['-name', 'flavour'])
      .get();
    const expected = '/pizza?sort=-name,flavour';

    expect(query).toEqual(expected);
  });

  it('can append params', () => {
    const builder = queryBuilder();
    const query = builder()
      .forModel('pizza')
      .where('name', 'meatlovers')
      .params({ format: 'admin' })
      .get();
    const expected = '/pizza?filter[name]=meatlovers&format=admin';

    expect(query).toEqual(expected);
  });

  it('the query object can be reused', () => {
    const builder = queryBuilder();

    const actualOne = builder()
      .forModel('pizza')
      .where('name', 'macaroni_and_cheese')
      .get();

    const expectedOne = '/pizza?filter[name]=macaroni_and_cheese';

    const actualTwo = builder()
      .forModel('pizza')
      .where('name', 'meatlovers')
      .get();

    const expectedTwo = '/pizza?filter[name]=meatlovers';

    expect(actualOne).toEqual(expectedOne);
    expect(actualTwo).toEqual(expectedTwo);
  });

  it('builds a semi-complex query', () => {
    const builder = queryBuilder();

    const query = builder()
      .forModel('pizza')
      .where('name', 'macaroni_and_cheese')
      .includes(['toppings'])
      .appends(['full_name'])
      .select(['name', 'ratings'])
      .params({ format: 'basic' })
      .get();
    const expected =
      '/pizza?include=toppings&append=full_name&fields[pizza]=name,ratings&filter[name]=macaroni_and_cheese&format=basic';

    expect(query).toEqual(expected);
  });
});
