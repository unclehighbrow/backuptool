const list = async (db) => {
  const res = await db.query("SELECT * FROM snapshot");
  console.table(res.rows);
};
export default list;
