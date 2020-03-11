This packages exposes types that allow you to extract deeply nested types.

# `type DeepExtractTypeSkipArrays<Source, Path extends [...string[]]>`

Extracts a deeply-nested type from the target `Path` in `Source`, skipping arrays and ignoring null|undefined|optional types:

```ts
type QueryResult = { allPosts?: Array<{ users?: Array<{ name: string }> }> };
// will be { name: string }
type User = DeepExtractTypeSkipArrays<QueryResult, ["allPosts", "users"]>;
```

# `type DeepExtractType<Source, Path extends [...(string | number)[]]>`

Extracts a deeply-nested type from the target `Path` in `Source`, ignoring null|undefined|optional types:

```ts
type QueryResult = { user?: { firstPost?: { title: string } } };
// will be { title: string }
type Post = DeepExtractType<QueryResult, ["user", "firstPost"]>;
```
