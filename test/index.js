import _db from "../db.js";
import init from "../init.js";
import snapshot from "../commands/snapshot.js";

(async () => {
  await init("backuptool_test");
  const db = await _db("backuptool_test");
  await snapshot(db, "test/test_folders/snapshot1");
  db.end();
})();
