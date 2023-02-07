# CogentTS

### A TypeScript version of [CogentJS](https://github.com/joelwmale/cogent-js) made by [Joel Male](https://github.com/joelwmale)

---
## Basic Usage

To use CogentTS, it's pretty simple. You just need to import the library and create a new instance of the Cogent class.

```typescript
import { queryBuilder } from '@lifespikes/cogent-ts';

const builder = queryBuilder();

// /posts?filter[name]=Bob&include=posts,comments&orderBy=-created_at
const url = builder()
    .forModel('posts') // the model you're selecting
	.where('name', 'Bob') // where the models `name` is 'Bob'
	.includes(['posts', 'comments']) // include the models related relationships: posts and comments
	.sort(['-created_at']) // order by -created_at desc
	.get(); // generate the url and pass it into fetch!
```

Also, `queryBuilder` receives a generic type that is the type of the model you're querying. This is used to provide type safety.

```typescript
import { queryBuilder } from '@lifespikes/cogent-ts';

interface Post {
    id: number;
    title: string;
    body: string;
}

const builder = queryBuilder<Post>();

// /posts?filter[name]=Bob&include=posts,comments&orderBy=-created_at

const url = builder()
    .forModel('posts') // the model you're selecting
    .where('name', 'Bob') // where the models `name` is 'Bob'
    .includes(['posts', 'comments']) // include the models related relationships: posts and comments
    .sort(['-created_at']) // order by -created_at desc
    .get(); // generate the url and pass it into fetch!
```

## Installation

### Npm
```bash
npm install @lifespikes/cogent-ts
```

### Yarn
```bash
yarn add @lifespikes/cogent-ts
```

## Additional Configuration
### Base URL
If you want to set a base url for all of your queries, you can do so by passing it into the `queryBuilder` function.

```typescript
import { queryBuilder } from '@lifespikes/cogent-ts';

const builder = queryBuilder({
    baseUrl: 'https://api.example.com'
});

// https://api.example.com/posts?filter[name]=Bob&include=posts,comments&orderBy=-created_at
const url = builder()
    .forModel('posts') // the model you're selecting
    .where('name', 'Bob') // where the models `name` is 'Bob'
    .includes(['posts', 'comments']) // include the models related relationships: posts and comments
    .sort(['-created_at']) // order by -created_at desc
    .get(); // generate the url and pass it into fetch!
```

## Available Methods

| Method     | Description                               | Example                                     |
|------------|-------------------------------------------|---------------------------------------------|
| `forModel` | The model you're querying.                | `builder().forModel('posts')`               |
| `where`    | Where clause.                             | `builder().where('name', 'Bob')`            |
| `includes` | Include the models related relationships. | `builder().includes(['posts', 'comments'])` |
| `sort`     | Order by clause.                          | `builder().sort(['-created_at'])`           |
| `orderBy`  | Same as `sort`                            | `builder().orderBy(['-created_at'])`        |
| `select`   | Select specific fields.                   | `builder().select(['id', 'name'])`          |
| `get`      | Generate the url.                         | `builder().get()`                           |
| `appends`  | Append additional fields.                 | `builder().appends(['full_name'])`          |
| `limit`    | Limit the number of results.              | `builder().limit(10)`                       |
| `page`     | Paginate the results.                     | `builder().page(2)`                         |
| `params`   | Add additional query params.              | `builder().params({ foo: 'bar' })`          |

## Customizing Query Parameters
The query parameters can be customized by passing in an configuration object to the `queryBuilder` function.

```typescript
import { queryBuilder } from '@lifespikes/cogent-ts';

const builder = queryBuilder({
    queryParams: {
        include: 'include_custom',
        filters: 'filter_custom',
        sort: 'sort_custom',
        fields: 'fields_custom',
        append: 'append_custom',
        page: 'page_custom',
        limit: 'limit_custom'
    }
});
