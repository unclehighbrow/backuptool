const prune = async (db, snapshotId) => {
  // find every file that isn't referenced by another snapshot
  const filesToDelete = await db
    .prepare(
      `SELECT sf1.file_id AS file_id FROM snapshot_file sf1 
            LEFT JOIN snapshot_file sf2 ON sf1.file_id=sf2.file_id AND sf2.snapshot_id!=sf1.snapshot_id
            WHERE sf1.snapshot_id = ? AND sf2.id IS NULL`
    )
    .all(snapshotId);

  await db
    .prepare("DELETE FROM snapshot_file WHERE snapshot_id = ?")
    .run(snapshotId);

  for (const file of filesToDelete) {
    await db.prepare("DELETE FROM file WHERE id = ?").run(file.file_id);
  }

  await db.prepare("DELETE FROM snapshot WHERE id = ?").run(snapshotId);
};

export default prune;
