import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    uploadNotifications: 'src/lambda/uploadNotifications.ts',
    checkDataConsistency: 'src/lambda/checkDataConsistency.ts',
    db: 'src/lambda/db.ts',
  },
  clean: true,
  outDir: 'build-lambda',
  noExternal: ['aws-sdk', 'knex', 'pg'],
  external: [
    "better-sqlite3",
    "tedious",
    "mysql",
    "mysql2",
    "oracledb",
    "sqlite3",
    "pg-query-stream",
  ],
});
