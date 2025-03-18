import pg from "pg";

const db = async (database) => {
  const { Client } = pg;
  const client = new Client({ database });
  await client.connect();
  return client;
};

export default db;
