import {
  mysqlTable,
  varbinary,
  int,
  varchar,
  binary,
  customType,
  MySqlVarbinaryOptions,
} from "drizzle-orm/mysql-core";

const pureVarbinary = <T extends Buffer = Buffer>(
  columnName: string,
  options: Pick<MySqlVarbinaryOptions, "length">
) => {
  return (
    customType<{
      data: Buffer;
      driverData: Buffer;
    }>({
      dataType: () => {
        return `varbinary(${options.length})`;
      },
      // # WORKAROUND✨
      // By not implementing unnecessary conversion processes in `fromDriver` and `toDriver`, we can save and retrieve values in the DB without corruption.
      fromDriver: (value) => {
        return value;
      },
      toDriver: (value) => {
        return value;
      },
    })(columnName)
      // The following line is a workaround for the issue with varbinary/binary type
      // [[BUG]: MySQL2 binary/varbinary types are incorrectly typed as strings instead of buffers · Issue #1188 · drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm/issues/1188)
      .$type<T>()
  );
};

const pureBinary = <T extends Buffer = Buffer>(
  columnName: string,
  options: Pick<MySqlVarbinaryOptions, "length">
) => {
  return customType<{
    data: Buffer;
    driverData: Buffer;
  }>({
    dataType: () => {
      return `varbinary(${options.length})`;
    },
    fromDriver: (value) => {
      return value;
    },
    toDriver: (value) => {
      return value;
    },
  })(columnName).$type<T>();
};

export const testTable = mysqlTable("test_table", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }),
  varbinaryData: pureVarbinary("varbinary_data", { length: 10 }),
  binaryData: pureBinary("binary_data", { length: 3 }),
});
