import _db from "./db.js";

const init = async (db) => {
  await db.query(`
        CREATE TABLE IF NOT EXISTS file (
            id SERIAL PRIMARY KEY,
            path TEXT NOT NULL,
            contents TEXT NOT NULL
        );
    `);
};

(async () => {
  const db = await _db("backuptool");
  await init(db);
})();

export default init;
