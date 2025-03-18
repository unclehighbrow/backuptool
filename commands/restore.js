import fs from "fs/promises";

const restore = async (db, snapshotId, outputDirectory) => {
  const files = await db.query({
    text: "SELECT contents, name FROM snapshot_file JOIN file ON snapshot_file.file_id=file.id WHERE snapshot_id = $1",
    values: [snapshotId],
  });

  console.log(files);

  for (const file of files.rows) {
    await fs.writeFile(`${outputDirectory}/${file.name}`, file.contents);
  }
};

export default restore;
