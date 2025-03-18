import fs from "fs/promises";

const restore = async (db, snapshotId, outputDirectory) => {
  const files = await db.query({
    text: "SELECT contents, path FROM snapshot_file JOIN file ON snapshot_file.file_id=file.id WHERE snapshot_id = $1",
    values: [snapshotId],
  });

  for (const file of files.rows) {
    // Ensure the directory exists
    await fs.mkdir(
      `${outputDirectory}/${file.path.substring(
        0,
        file.path.lastIndexOf("/")
      )}`,
      { recursive: true }
    );
    // Write the file
    await fs.writeFile(`${outputDirectory}/${file.path}`, file.contents);
  }
};

export default restore;
