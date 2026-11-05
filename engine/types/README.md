# types/

TypeScript declarations for the `nanomind-x` package (`index.d.ts` is the package `types` entry; `client/` covers the HTTP client).

Consumers get them automatically:

    import { nanomind-x } from 'nanomind-x';   // typed

When you add or change a public export in `src/`, update the matching declaration here.
