import _db from "../db.js";
import init from "../init.js";
import snapshot from "../commands/snapshot.js";

(async () => {
  await init("backuptool_test");
  const db = await _db("backuptool_test");
  snapshot(db, "/Users/will/Desktop/snapshot1");
  db.end();
})();
