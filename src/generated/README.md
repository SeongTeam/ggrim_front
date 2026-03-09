### DTO type definition

- Backend API DTO doc is created by `@nestjs/swagger` plugin
- To validate API DTO doc, use `openapi-typescript` to generate API code from OpenAPI doc

- below cmd generate DTO type, path, params, query from Open API Doc created by swagger

```
npx openapi-typescript http://localhost:3000/api-json -o src/generated/dto-types.ts --enum --dedupe-enums --export-type --root-types --root-types-no-schema-prefix
```
