import {
  mysqlTable,
  varbinary,
  int,
  varchar,
  binary,
} from "drizzle-orm/mysql-core";

export const testTable = mysqlTable("test_table", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }),
  varbinaryData: varbinary("varbinary_data", { length: 10 })
    // The following line is a workaround for the issue with varbinary/binary type
    // [[BUG]: MySQL2 binary/varbinary types are incorrectly typed as strings instead of buffers · Issue #1188 · drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm/issues/1188)
    .$type<Buffer>(),
  binaryData: binary("binary_data", { length: 3 }).$type<Buffer>(),
});
