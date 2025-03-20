import _db from "./db.js";

const init = (dbName = "backuptool") => {
  const db = _db(dbName);

  // create tables
  db.exec(`
    DROP TABLE IF EXISTS snapshot_file;
    DROP TABLE IF EXISTS file;
    DROP TABLE IF EXISTS snapshot;

    CREATE TABLE file (
      id INTEGER PRIMARY KEY,
      sha varchar(255) NOT NULL,
      contents BYTEA NOT NULL
    );

    CREATE TABLE snapshot (
      id INTEGER PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      directory_name varchar(255) NOT NULL
    );

    CREATE TABLE snapshot_file (
      id INTEGER PRIMARY KEY,
      path varchar(255) NOT NULL,
      file_id integer NOT NULL,
      snapshot_id integer NOT NULL
    );
  `);

  db.close();
};

export default init;
