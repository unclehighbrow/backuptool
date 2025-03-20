import fs from "fs/promises";

const restore = async (db, snapshotId, outputDirectory) => {
  const files = await db
    .prepare(
      "SELECT contents, path FROM snapshot_file JOIN file ON snapshot_file.file_id=file.id WHERE snapshot_id = ?"
    )
    .all(snapshotId);

  for (const file of files) {
    // Ensure the directory exists
    const directoriesToMake = `${outputDirectory}/${file.path.substring(
      0,
      file.path.lastIndexOf("/")
    )}`;

    await fs.mkdir(directoriesToMake, { recursive: true });
    // Write the file
    await fs.writeFile(`${outputDirectory}/${file.path}`, file.contents);
  }
};

export default restore;
