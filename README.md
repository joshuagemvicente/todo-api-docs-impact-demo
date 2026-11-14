# Todo API documentation-impact demo

A minimal NestJS to-do API used to demonstrate a docs-maintenance check:

1. A pull request changes `openapi.json`.
2. The GitHub Action compares the base and pull-request API operations.
3. It finds MDX files whose `covers` metadata maps to changed operations.
4. The check fails if those docs were not also changed.

## Run

```sh
npm install
npm run start:dev
```

Open `http://localhost:3000/docs` for the Swagger UI.

## Demonstrate the failed check

```sh
npm run check:docs-impact
```

The fixture uses the old `text` request field while the current spec requires `title`. The `POST /todos` guide is mapped to that operation but was not marked as changed, so the check fails deliberately.

`scripts/check-doc-impact.mjs` is intentionally operation-level. `shortcut: it does not identify individual field renames; replace its operation diff with oasdiff's machine-readable change model when the MVP needs field-level policy.`
