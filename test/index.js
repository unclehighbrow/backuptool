import _db from "../db.js";
import init from "../init.js";

(async () => {
  const initDb = await _db();
  const result = await initDb.query(`
    SELECT 1 FROM pg_database WHERE datname = 'backuptool_test';
`);

  if (result.rowCount === 0) {
    await initDb.query(`
        CREATE DATABASE backuptool_test;
    `);
  }

  const db = await _db("backuptool_test");
  await init(db);
  await db.end();
})();
