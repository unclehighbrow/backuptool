import _db from "./db.js";

const init = async (dbName = "backuptool") => {
  // create database if it's not already there
  const initDb = await _db();
  const result = await initDb.query(`
    SELECT 1 FROM pg_database WHERE datname = '${dbName}';
  `);

  if (result.rowCount === 0) {
    await initDb.query(`
      CREATE DATABASE ${dbName};
    `);
  }

  await initDb.end();

  const db = await _db(dbName);

  // create tables
  await db.query(`
    DROP TABLE IF EXISTS snapshot_file;
    DROP TABLE IF EXISTS file;
    DROP TABLE IF EXISTS snapshot;

    CREATE TABLE file (
      id SERIAL PRIMARY KEY,
      sha varchar(255) NOT NULL,
      contents BYTEA NOT NULL
    );

    CREATE TABLE snapshot (
      id SERIAL PRIMARY KEY,
      created_at timestamp without time zone DEFAULT now(),
      directory_name character varying(255) NOT NULL
    );

    CREATE TABLE snapshot_file (
      id SERIAL PRIMARY KEY,
      path varchar(255) NOT NULL,
      file_id integer NOT NULL,
      snapshot_id integer NOT NULL
    );

    ALTER TABLE snapshot_file
      ADD FOREIGN KEY (file_id) REFERENCES file (id); 
    
    ALTER TABLE snapshot_file
      ADD FOREIGN KEY (snapshot_id) REFERENCES snapshot (id);
  `);

  await db.end();
};

export default init;
