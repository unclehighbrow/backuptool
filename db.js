import { DatabaseSync } from "node:sqlite";

const db = (database) => {
  return new DatabaseSync(`./${database}.db`);
};

export default db;
