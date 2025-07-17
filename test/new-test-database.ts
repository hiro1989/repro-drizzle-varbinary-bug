import type { StartedMySqlContainer } from "@testcontainers/mysql";

import { MySqlContainer } from "@testcontainers/mysql";
import { sql } from "drizzle-orm";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import path from "node:path";
import { testTable } from "../src/schema";

export type DBClient = MySql2Database<{
  testTable: typeof testTable;
}>;

export type TestDatabase = {
  clearAllTables: (db: DBClient) => Promise<void>;
  setup: () => Promise<DBClient>;
  teardown: () => Promise<void>;
};

export const newTestDatabase = (): TestDatabase => {
  let container: StartedMySqlContainer | undefined;

  return {
    clearAllTables: async (db: DBClient): Promise<void> => {
      await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 0;"));
      const [result] = await db.execute<{ TABLE_NAME: string }>(
        sql.raw(
          "SELECT table_name FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = DATABASE();"
        )
      );
      const tables = Array.isArray(result)
        ? result.map((row: { TABLE_NAME: string }) => row.TABLE_NAME)
        : [];
      for (const table of tables) {
        await db.execute(sql.raw(`DELETE FROM ${table};`));
      }
      await db.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 1;"));
    },
    setup: async () => {
      container = await new MySqlContainer("mysql:8.0.42").start();

      const option = {
        connectionLimit: 1,
        database: container.getDatabase(),
        host: container.getHost(),
        password: container.getUserPassword(),
        port: container.getPort(),
        user: container.getUsername(),
      };

      const pool = mysql.createPool(option);
      const client: DBClient = drizzle(pool);

      await migrate(client, {
        migrationsFolder: path.join(
          import.meta.dirname,
          "../",
          "src/migrations"
        ),
      });

      return client;
    },
    teardown: async () => {
      if (!container) {
        console.error("test database is not set up");
        return;
      }
      await container.stop();
      container = undefined;
    },
  };
};
