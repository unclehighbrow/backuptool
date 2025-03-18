const prune = async (db, snapshotId) => {
  // find every file that isn't referenced by another snapshot
  const filesToDelete = await db.query({
    text: `SELECT sf1.file_id AS file_id FROM snapshot_file sf1 
            LEFT JOIN snapshot_file sf2 ON sf1.file_id=sf1.file_id AND sf2.snapshot_id!=sf1.snapshot_id
            WHERE sf1.snapshot_id = $1 AND sf2.id IS NULL`,
    values: [snapshotId],
  });

  for (const file of filesToDelete.rows) {
    await db.query({
      text: "DELETE FROM file WHERE id = $1",
      values: [file.file_id],
    });
  }

  await db.query({
    text: "DELETE FROM snapshot_file WHERE snapshot_id = $1",
    values: [snapshotId],
  });

  await db.query({
    text: "DELETE FROM snapshot WHERE id = $1",
    values: [snapshotId],
  });
};

export default prune;
