# Scripts

This folder will contain utility and seed scripts for the project.

## Planned scripts

| Script | Purpose |
|---|---|
| `seed.ts` | Populate the database with initial victim profile data for development |
| `migrate.ts` | Run Prisma migrations in a specific environment |
| `import-csv.ts` | Bulk-import victim records from a CSV file |

## Usage

Scripts are run directly with `ts-node` or `npx tsx` from the repo root:

```bash
npx tsx scripts/seed.ts
```

Add new scripts here as they are created. Do not commit sensitive data (real names, contacts) in seed files — use anonymised fixture data for development.
