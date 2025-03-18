import fs from "fs/promises";
import crypto from "crypto";

const snapshotDirectory = async (
  db,
  directoryName,
  snapshotId,
  subdirectoryName = ""
) => {
  const fullPath = `${directoryName}${
    subdirectoryName ? "/" + subdirectoryName : ""
  }`;

  let files;
  try {
    files = await fs.readdir(fullPath);
  } catch (e) {
    console.error(`Directory "${fullPath}" does not exist`);
    process.exit(1);
  }

  // loop through every file in the directory
  for (const fileName of files) {
    const filePath = `${fullPath}/${fileName}`;

    const stat = await fs.lstat(filePath);
    if (stat.isDirectory()) {
      // recursively snapshot subdirectories
      await snapshotDirectory(
        db,
        directoryName,
        snapshotId,
        `${subdirectoryName}${fileName}/`
      );
      continue;
    }

    let contents;
    try {
      contents = await fs.readFile(filePath);
    } catch (e) {
      console.error(`Failed to read file "${filePath}":`, e.message);
      continue;
    }

    const sha = crypto.createHash("sha256").update(contents).digest("hex");

    let fileId;

    const existingFile = await db.query({
      text: "SELECT * FROM file WHERE sha = $1",
      values: [sha],
    });

    // check if the file already exists in the database
    if (existingFile.rows.length > 0) {
      fileId = existingFile.rows[0].id;
    } else {
      // if the file doesn't exist, insert it into the database
      const insertResult = await db.query({
        text: "INSERT INTO file (contents, sha) VALUES ($1, $2) RETURNING id",
        values: [contents, sha],
      });
      fileId = insertResult.rows[0].id;
    }

    await db.query({
      text: "INSERT INTO snapshot_file (snapshot_id, file_id, path) VALUES ($1, $2, $3)",
      values: [snapshotId, fileId, `${subdirectoryName}${fileName}`],
    });
  }
};

const snapshot = async (db, directoryName) => {
  const newSnapshot = await db.query({
    text: "INSERT INTO snapshot (directory_name) VALUES ($1) RETURNING id",
    values: [directoryName],
  });

  await snapshotDirectory(db, directoryName, newSnapshot.rows[0].id);
};

export default snapshot;
