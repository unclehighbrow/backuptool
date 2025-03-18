import pg from "pg";

const db = async () => {
  const { Client } = pg;
  const client = new Client({ database: "backuptool" });
  await client.connect();
  return client;
};

export default db;
