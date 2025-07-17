import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "testpass",
    database: "testdb",
  },
});
