import _db from "../db.js";

const list = async () => {
  const db = await _db();
  const res = await db.query("select * from snapshot");
  console.table(res.rows);
  await db.end();
};
export default list;
