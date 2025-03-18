const list = async (db) => {
  const res = await db.query("select * from snapshot");
  console.table(res.rows);
};
export default list;
