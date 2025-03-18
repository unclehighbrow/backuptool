import fs from "fs/promises";
import crypto from "crypto";

const snapshotDirectory = async (db, directoryName, snapshotId) => {
  let files;
  try {
    files = await fs.readdir(directoryName);
  } catch (e) {
    console.error(`Directory "${directoryName}" does not exist`);
    process.exit(1);
  }

  for (const file of files) {
    const filePath = `${directoryName}/${file}`;
    let contents;
    try {
      contents = await fs.readFile(filePath);
    } catch (e) {
      //console.error(`Failed to read file "${filePath}":`, e.message);
      continue;
    }

    const sha = crypto.createHash("sha256").update(contents).digest("hex");

    let fileId;

    const existingFile = await db.query({
      text: "SELECT * FROM file WHERE sha = $1",
      values: [sha],
    });

    if (existingFile.rows.length > 0) {
      fileId = existingFile.rows[0].id;
    } else {
      const insertResult = await db.query({
        text: "INSERT INTO file (contents, sha) VALUES ($1, $2) RETURNING id",
        values: [contents, sha],
      });
      fileId = insertResult.rows[0].id;
    }

    await db.query({
      text: "INSERT INTO snapshot_file (snapshot_id, file_id) VALUES ($1, $2)",
      values: [snapshotId, fileId],
    });
  }
};

const snapshot = async (db, directoryName) => {
  const newSnapshot = await db.query({
    text: "INSERT INTO snapshot (directory_name) VALUES ($1) RETURNING id",
    values: [directoryName],
  });

  await snapshotDirectory(db, directoryName, newSnapshot.rows[0].id);

  await db.end();
};

export default snapshot;
