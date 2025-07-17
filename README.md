# Drizzle ORM MySQL VARBINARY/BINARY Bug Reproduction

This repository reproduces a bug in drizzle-orm related to MySQL's varbinary and binary data types.

## Bug Overview

Starting from Drizzle ORM v0.41.0, data retrieved from MySQL VARBINARY/BINARY columns is incorrectly returned as strings instead of Buffer objects.

### Bug Details

- **Affected Versions**: drizzle-orm v0.41.0 and later
- **Affected Data Types**: MySQL `VARBINARY` and `BINARY` columns
- **Expected Behavior**: Data should be returned as Buffer objects
- **Actual Behavior**: Data is returned as strings
- **Related links**:
  - [[BUG]: MySQL2 binary/varbinary types are incorrectly typed as strings instead of buffers · Issue #1188 · drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm/issues/1188)
  - [Various fixes, features bundled for v0.41.0 (#4293) · drizzle-team/drizzle-orm@f39f885](https://github.com/drizzle-team/drizzle-orm/commit/f39f885779800982e90dd3c89aba6df3217a6fd2#diff-7f419fc03c01575cb3631269ad5bfb388160fc3d9e76dee239c9427013884fb7R44-R55)

## Environment

- **Node.js**: v22.17.1
- **MySQL**: 8.0 (via TestContainers)
- **Test Framework**: Vitest
- **Database Setup**: @testcontainers/mysql

## Tested Versions

This project allows you to reproduce the bug across different drizzle-orm versions:

### v0.40.1 (Latest version without the bug)

Change `drizzle-orm` to `"0.40.1"` in `package.json` and run tests

**Test Results**:

```js
$ npm i && npm test

 DEV  v3.2.4 /Users/biz/work/study/repro-drizzle-varbinary-bug

 ✓ test/binary.test.ts (1 test) 10359ms
   ✓ Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string 10ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  12:25:46
   Duration  11.03s (transform 29ms, setup 0ms, collect 527ms, tests 10.36s, environment 0ms, prepare 35ms)
```

### v0.41.0 (First version with the bug)

Change `drizzle-orm` to `"0.41.0"` in `package.json` and run tests

**Test Results**:

```js
$ npm i && npm test

 DEV  v3.2.4 /Users/biz/work/study/repro-drizzle-varbinary-bug

 ❯ test/binary.test.ts (1 test | 1 failed) 13127ms
   × Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string 23ms
     → expected '\ufffd\ufffd\ufffd' to be an instance of Buffer
     → expected '\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253 ]
     → expected '\ufffd\ufffd\ufffd\ufffd' to be an instance of Buffer
     → expected '\ufffd\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253, 252 ]
     → expected Buffer[ 239, 191, 189, 239, 191, …(-179) ] to strictly equal Buffer[ 255, 254, 253 ]
     → expected Buffer[ 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253 ]
     → expected Buffer[ 239, 191, 189, 239, 191, …(-176) ] to strictly equal Buffer[ 255, 254, 253, 252 ]
     → expected Buffer[ 253, 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253, 252 ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd' to be an instance of Buffer
 ❯ test/binary.test.ts:40:42
     38|
     39|     // These should pass but ver.0.41.0 or higher fail because they are unexpectedly converted to strings.
     40|     expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
       |                                          ^
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253 ]

- Expected:
Buffer [
  255,
  254,
  253,
]

+ Received:
"���"

 ❯ test/binary.test.ts:41:42
     39|     // These should pass but ver.0.41.0 or higher fail because they are unexpectedly converted to strings.
     40|     expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
       |                                          ^
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
     43|     expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd\ufffd' to be an instance of Buffer
 ❯ test/binary.test.ts:42:45
     40|     expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
       |                                             ^
     43|     expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);
     44|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253, 252 ]

- Expected:
Buffer [
  255,
  254,
  253,
  252,
]

+ Received:
"����"

 ❯ test/binary.test.ts:43:45
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
     43|     expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);
       |                                             ^
     44|
     45|     // Attempt to restore the string to Buffer

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 239, 191, 189, 239, 191, …(-179) ] to strictly equal Buffer[ 255, 254, 253 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
-     253,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:49:35
     47|       const restoredAsUTF8 = Buffer.from(selectResult.binaryData, "utf-8");
     48|       expect.soft(restoredAsUTF8).toBeInstanceOf(Buffer);
     49|       expect.soft(restoredAsUTF8).toStrictEqual(testBinary);
       |                                   ^
     50|       const restoredAsBinary = Buffer.from(selectResult.binaryData, "binary");
     51|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
+     253,
+     253,
      253,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:52:37
     50|       const restoredAsBinary = Buffer.from(selectResult.binaryData, "binary");
     51|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);
     52|       expect.soft(restoredAsBinary).toStrictEqual(testBinary);
       |                                     ^
     53|     }
     54|     if (typeof selectResult.varbinaryData === "string") {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 239, 191, 189, 239, 191, …(-176) ] to strictly equal Buffer[ 255, 254, 253, 252 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
-     253,
-     252,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:57:35
     55|       const restoredAsUTF8 = Buffer.from(selectResult.varbinaryData, "utf-8");
     56|       expect.soft(restoredAsUTF8).toBeInstanceOf(Buffer);
     57|       expect.soft(restoredAsUTF8).toStrictEqual(testVarbinary);
       |                                   ^
     58|       const restoredAsBinary = Buffer.from(selectResult.varbinaryData, "binary");
     59|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 253, 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253, 252 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
      253,
-     252,
+     253,
+     253,
+     253,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:60:37
     58|       const restoredAsBinary = Buffer.from(selectResult.varbinaryData, "binary");
     59|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);
     60|       expect.soft(restoredAsBinary).toStrictEqual(testVarbinary);
       |                                     ^
     61|     }
     62|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/8]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  12:27:53
   Duration  13.87s (transform 44ms, setup 0ms, collect 558ms, tests 13.13s, environment 0ms, prepare 79ms)
```

### v0.44.3 (Current latest version)

Change `drizzle-orm` to `"0.44.3"` in `package.json` and run tests

**Test Results**:

Same as v0.41.0, the bug persists.

```js
 DEV  v3.2.4 /Users/biz/work/study/repro-drizzle-varbinary-bug

 ❯ test/binary.test.ts (1 test | 1 failed) 12823ms
   × Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string 22ms
     → expected '\ufffd\ufffd\ufffd' to be an instance of Buffer
     → expected '\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253 ]
     → expected '\ufffd\ufffd\ufffd\ufffd' to be an instance of Buffer
     → expected '\ufffd\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253, 252 ]
     → expected Buffer[ 239, 191, 189, 239, 191, …(-179) ] to strictly equal Buffer[ 255, 254, 253 ]
     → expected Buffer[ 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253 ]
     → expected Buffer[ 239, 191, 189, 239, 191, …(-176) ] to strictly equal Buffer[ 255, 254, 253, 252 ]
     → expected Buffer[ 253, 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253, 252 ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd' to be an instance of Buffer
 ❯ test/binary.test.ts:40:42
     38|
     39|     // These should pass but ver.0.41.0 or higher fail because they are unexpectedly converted to strings.
     40|     expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
       |                                          ^
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253 ]

- Expected:
Buffer [
  255,
  254,
  253,
]

+ Received:
"���"

 ❯ test/binary.test.ts:41:42
     39|     // These should pass but ver.0.41.0 or higher fail because they are unexpectedly converted to strings.
     40|     expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
       |                                          ^
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
     43|     expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd\ufffd' to be an instance of Buffer
 ❯ test/binary.test.ts:42:45
     40|     expect.soft(selectResult.binaryData).toBeInstanceOf(Buffer);
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
       |                                             ^
     43|     expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);
     44|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected '\ufffd\ufffd\ufffd\ufffd' to strictly equal Buffer[ 255, 254, 253, 252 ]

- Expected:
Buffer [
  255,
  254,
  253,
  252,
]

+ Received:
"����"

 ❯ test/binary.test.ts:43:45
     41|     expect.soft(selectResult.binaryData).toStrictEqual(testBinary);
     42|     expect.soft(selectResult.varbinaryData).toBeInstanceOf(Buffer);
     43|     expect.soft(selectResult.varbinaryData).toStrictEqual(testVarbinary);
       |                                             ^
     44|
     45|     // Attempt to restore the string to Buffer

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 239, 191, 189, 239, 191, …(-179) ] to strictly equal Buffer[ 255, 254, 253 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
-     253,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:49:35
     47|       const restoredAsUTF8 = Buffer.from(selectResult.binaryData, "utf-8");
     48|       expect.soft(restoredAsUTF8).toBeInstanceOf(Buffer);
     49|       expect.soft(restoredAsUTF8).toStrictEqual(testBinary);
       |                                   ^
     50|       const restoredAsBinary = Buffer.from(selectResult.binaryData, "binary");
     51|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
+     253,
+     253,
      253,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:52:37
     50|       const restoredAsBinary = Buffer.from(selectResult.binaryData, "binary");
     51|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);
     52|       expect.soft(restoredAsBinary).toStrictEqual(testBinary);
       |                                     ^
     53|     }
     54|     if (typeof selectResult.varbinaryData === "string") {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 239, 191, 189, 239, 191, …(-176) ] to strictly equal Buffer[ 255, 254, 253, 252 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
-     253,
-     252,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
+     239,
+     191,
+     189,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:57:35
     55|       const restoredAsUTF8 = Buffer.from(selectResult.varbinaryData, "utf-8");
     56|       expect.soft(restoredAsUTF8).toBeInstanceOf(Buffer);
     57|       expect.soft(restoredAsUTF8).toStrictEqual(testVarbinary);
       |                                   ^
     58|       const restoredAsBinary = Buffer.from(selectResult.varbinaryData, "binary");
     59|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/8]⎯

 FAIL  test/binary.test.ts > Drizzle varbinary bug reproduction > should handle varbinary data as Buffer, not string
AssertionError: expected Buffer[ 253, 253, 253, 253 ] to strictly equal Buffer[ 255, 254, 253, 252 ]

- Expected
+ Received

  {
    "data": [
-     255,
-     254,
      253,
-     252,
+     253,
+     253,
+     253,
    ],
    "type": "Buffer",
  }

 ❯ test/binary.test.ts:60:37
     58|       const restoredAsBinary = Buffer.from(selectResult.varbinaryData, "binary");
     59|       expect.soft(restoredAsBinary).toBeInstanceOf(Buffer);
     60|       expect.soft(restoredAsBinary).toStrictEqual(testVarbinary);
       |                                     ^
     61|     }
     62|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/8]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  12:29:04
   Duration  13.56s (transform 29ms, setup 0ms, collect 600ms, tests 12.82s, environment 0ms, prepare 34ms)
```

## Reproduction Steps

### Prerequisites

- Node.js v22
- Docker (for TestContainers)

### How to Run

1. Clone the repository

```bash
git clone https://github.com/hiro1989/repro-drizzle-varbinary-bug
cd repro-drizzle-varbinary-bug
```

2. Install dependencies

```bash
npm install
```

3. Run tests

```bash
npm test
```

### Testing Different Versions

To test with different drizzle-orm versions:

1. Update the `drizzle-orm` version in `package.json`
2. Reinstall dependencies

```bash
npm install
```

3. Run tests

```bash
npm test
```

## Project Structure

```sh
├── src/
│   ├── schema.ts           # Drizzle schema definition
│   └── migrations/         # Database migration files
└── test/
    ├── binary-bug.test.ts       # Bug reproduction test
    └── new-test-database.ts     # Test database initialization
```

## About This Bug Report

This repository is designed to reproduce a bug in the open-source Drizzle ORM project. Discussions about bug details and fixes are conducted in the official Drizzle ORM repository.

### Reported Issue

- TODO

## Acknowledgments

Drizzle ORM is an excellent TypeScript ORM/query builder, and we deeply appreciate the development team's continuous improvements and contributions. We hope this bug report contributes to solving the issue and the continued evolution of this great library.

## License

This project is provided under the MIT License.
