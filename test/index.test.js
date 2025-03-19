import _db from "../db.js";
import init from "../init.js";
import snapshot from "../commands/snapshot.js";

beforeEach(async () => {
  await init("backuptool_test");
});

test("snapshot stores the right amount of data", async () => {
  const db = await _db("backuptool_test");
  await snapshot(db, "test/test_folders/snapshot1");
  const snapshotResult = await db.query("SELECT * FROM snapshot");
  expect(snapshotResult.rows.length).toBe(1);
  const snapshotFileResult = await db.query("SELECT * FROM snapshot_file");
  expect(snapshotFileResult.rows.length).toBe(8);
  const fileResult = await db.query("SELECT * FROM file");
  expect(fileResult.rows.length).toBe(7);
  db.end();
});
