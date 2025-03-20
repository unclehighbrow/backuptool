import fs from "fs/promises";
import _db from "../db.js";
import init from "../init.js";
import snapshot from "../commands/snapshot.js";
import restore from "../commands/restore.js";
import prune from "../commands/prune.js";
import { compareDirectories } from "./util.js";

let db;

beforeEach(() => {
  init("backuptool_test");
  db = _db("backuptool_test");
});

afterEach(async () => {
  await db.close();
});

test("snapshot stores the right amount of data", async () => {
  await snapshot(db, "test/test_folders/snapshot1");
  const snapshotResult = await db
    .prepare("SELECT COUNT(*) AS cnt FROM snapshot")
    .get();
  expect(snapshotResult.cnt).toBe(1);
  const snapshotFileResult = await db
    .prepare("SELECT COUNT(*) AS cnt FROM snapshot_file")
    .get();
  expect(snapshotFileResult.cnt).toBe(6);
  const fileResult = await db.prepare("SELECT COUNT(*) AS cnt FROM file").get();
  expect(fileResult.cnt).toBe(5);
});

test("snapshot will restore files that have changed after restore", async () => {
  await snapshot(db, "test/test_folders/snapshot1");
  await restore(db, 1, "test/test_result_folders/restore1");

  await fs.unlink("test/test_result_folders/restore1/nes-asm-back.png");
  await fs.copyFile(
    "test/test_result_folders/restore1/okay_in_japanese.txt",
    "test/test_result_folders/restore1/same_file.txt"
  );
  await restore(db, 1, "test/test_result_folders/restore1");

  await compareDirectories(
    "test/test_folders/snapshot1",
    "test/test_result_folders/restore1"
  );
});

test("snapshotting twice doesn't store the files twice", async () => {
  await snapshot(db, "test/test_folders/snapshot1");
  const fileResult = await db.prepare("SELECT COUNT(*) AS cnt FROM file").get();
  await snapshot(db, "test/test_folders/snapshot1");
  const fileResult2 = await db
    .prepare("SELECT COUNT(*) AS cnt FROM file")
    .get();
  expect(fileResult.cnt).toEqual(fileResult2.cnt);
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

  const snapshotResult = await db
    .prepare("SELECT COUNT(*) AS cnt FROM snapshot")
    .get();
  expect(snapshotResult.cnt).toBe(2);
  const snapshotFileResult = await db
    .prepare("SELECT COUNT(*) AS cnt FROM snapshot_file")
    .get();
  expect(snapshotFileResult.cnt).toBe(10);
  const fileResult = await db.prepare("SELECT COUNT(*) AS cnt FROM file").get();
  expect(fileResult.cnt).toBe(6);

  await prune(db, 2);

  const snapshotResult2 = await db
    .prepare("SELECT COUNT(*) AS cnt FROM snapshot")
    .get();
  expect(snapshotResult2.cnt).toBe(1);
  const snapshotFileResult2 = await db
    .prepare("SELECT COUNT(*) AS cnt FROM snapshot_file")
    .get();
  expect(snapshotFileResult2.cnt).toBe(6);
  const fileResult2 = await db
    .prepare("SELECT COUNT(*) AS cnt FROM file")
    .get();
  expect(fileResult2.cnt).toBe(5);
});
