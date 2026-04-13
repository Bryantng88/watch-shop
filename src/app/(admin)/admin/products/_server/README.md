# Product _server refactor proposal

This refactor keeps current imports working while reorganizing files by sub-domain.

## New structure

- `shared/`
  - pure helpers, DTOs, mappers, rules
- `core/`
  - main product service/repo
- `pricing/`
  - pricing-only service/repo
- `content/`
  - content facts + generators
- `ai/`
  - AI-related server types/services

## Compatibility wrappers

Top-level files such as `product.service.ts`, `product.repo.ts`, `rules.ts`, etc. re-export from the new folders so you can migrate imports gradually.

## Suggested next step

1. Update imports in route/page code to import directly from the new folders.
2. Delete wrappers after the codebase is fully migrated.
3. Rename any remaining `.tsx` server files to `.ts`.
