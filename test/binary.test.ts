import { eq } from "drizzle-orm";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  expectTypeOf,
  it,
} from "vitest";
import { testTable } from "../src/schema.js";
import { DBClient, newTestDatabase } from "./new-test-database.js";

describe("Drizzle varbinary bug reproduction", () => {
  const testDatabase = newTestDatabase();
  let db: DBClient;

  beforeAll(async () => {
    // Start MySQL container
    db = await testDatabase.setup();
  });

  afterAll(async () => {
    await testDatabase.teardown();
  });

  it("should handle varbinary data as Buffer, not string", async () => {
    // Test data
    const testBinary = Buffer.from([0xff, 0xfe, 0xfd]);
    const testVarbinary = Buffer.from([0xff, 0xfe, 0xfd, 0xfc]);
    const testName = "test-record";

    // Insert data
    const insertResult = await db.insert(testTable).values({
      name: testName,
      binaryData: testBinary,
      varbinaryData: testVarbinary,
    });
    expect(insertResult[0].affectedRows).toStrictEqual(1);

    // Select data back
    const [selectResult] = await db
      .select()
      .from(testTable)
      .where(eq(testTable.name, testName));

    // These should pass but ver.0.41.0 or higher fail because they are unexpectedly converted to strings.
    expectTypeOf(selectResult.binaryData).toEqualTypeOf<Buffer | null>();
    expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
    expect.soft(selectResult.binaryData).toStrictEqual(testBinary);

    expectTypeOf(selectResult.varbinaryData).toEqualTypeOf<Buffer | null>();
    expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
    expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);

    // Attempt to restore the string to Buffer
    if (typeof selectResult.binaryData === "string") {
      const restoredAsUTF8 = Buffer.from(selectResult.binaryData, "utf-8");
      expect.soft(restoredAsUTF8).toBeInstanceOf(Buffer);
      expect.soft(restoredAsUTF8).toStrictEqual(testBinary);
      const restoredAsBinary = Buffer.from(selectResult.binaryData, "binary");
      expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);
      expect.soft(restoredAsBinary).toStrictEqual(testBinary);
    }
    if (typeof selectResult.varbinaryData === "string") {
      const restoredAsUTF8 = Buffer.from(selectResult.varbinaryData, "utf-8");
      expect.soft(restoredAsUTF8).toBeInstanceOf(Buffer);
      expect.soft(restoredAsUTF8).toStrictEqual(testVarbinary);
      const restoredAsBinary = Buffer.from(
        selectResult.varbinaryData,
        "binary"
      );
      expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);
      expect.soft(restoredAsBinary).toStrictEqual(testVarbinary);
    }
  });
});
