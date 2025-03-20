const list = async (db) => {
  const res = await db.prepare("SELECT * FROM snapshot").all();
  console.table(res);
};
export default list;
