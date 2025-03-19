import _db from "../db.js";
import init from "../init.js";
import snapshot from "../commands/snapshot.js";
import restore from "../commands/restore.js";
import prune from "../commands/prune.js";
import { compareDirectories } from "./util.js";

let db;

beforeEach(async () => {
  await init("backuptool_test");
  db = await _db("backuptool_test");
});

afterEach(async () => {
  await db.end();
});

test("snapshot stores the right amount of data", async () => {
  await snapshot(db, "test/test_folders/snapshot1");
  const snapshotResult = await db.query("SELECT * FROM snapshot");
  expect(snapshotResult.rows.length).toBe(1);
  const snapshotFileResult = await db.query("SELECT * FROM snapshot_file");
  expect(snapshotFileResult.rows.length).toBe(6);
  const fileResult = await db.query("SELECT * FROM file");
  expect(fileResult.rows.length).toBe(5);
});

test("restore restores all files", async () => {
  await snapshot(db, "test/test_folders/snapshot1");
  await restore(db, 1, "test/test_result_folders/restore1");
  await compareDirectories(
    "test/test_folders/snapshot1",
    "test/test_result_folders/restore1"
  );

  await snapshot(db, "test/test_folders/snapshot2");
  await restore(db, 2, "test/test_result_folders/restore2");
  await compareDirectories(
    "test/test_folders/snapshot2",
    "test/test_result_folders/restore2"
  );
});

test("prunes without deleting data in other snapshots", async () => {
  await snapshot(db, "test/test_folders/snapshot1");
  await snapshot(db, "test/test_folders/snapshot2");

  const snapshotResult = await db.query("SELECT * FROM snapshot");
  expect(snapshotResult.rows.length).toBe(2);
  const snapshotFileResult = await db.query("SELECT * FROM snapshot_file");
  expect(snapshotFileResult.rows.length).toBe(10);
  const fileResult = await db.query("SELECT * FROM file");
  expect(fileResult.rows.length).toBe(6);

  await prune(db, 2);

  const snapshotResult2 = await db.query("SELECT * FROM snapshot");
  expect(snapshotResult2.rows.length).toBe(1);
  const snapshotFileResult2 = await db.query("SELECT * FROM snapshot_file");
  expect(snapshotFileResult2.rows.length).toBe(6);
  const fileResult2 = await db.query("SELECT * FROM file");
  expect(fileResult2.rows.length).toBe(5);
});
