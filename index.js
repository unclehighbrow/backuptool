import _db from "./db.js";
import list from "./commands/list.js";
import snapshot from "./commands/snapshot.js";
import restore from "./commands/restore.js";
import prune from "./commands/prune.js";

(async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  const db = _db("backuptool");

  switch (command) {
    case "snapshot":
      const directoryName = args[1];
      if (!directoryName) {
        console.error("Please provide a directory name");
        process.exit(1);
      }
      await snapshot(db, directoryName);
      break;
    case "restore":
      const restoreSnapshotId = args[1];
      if (!restoreSnapshotId) {
        console.error("Please provide a snapshot ID");
        process.exit(1);
      }
      const outputDirectory = args[2];
      if (!outputDirectory) {
        console.error("Please provide an output directory");
        process.exit(1);
      }
      await restore(db, restoreSnapshotId, outputDirectory);
      break;
    case "prune":
      const pruneSnapshotId = args[1];
      if (!pruneSnapshotId) {
        console.error("Please provide a snapshot ID");
        process.exit(1);
      }
      await prune(db, pruneSnapshotId);
      break;
    case "list":
      await list(db);
      break;
    default:
      console.error("Unknown command");
      process.exit(1);
  }

  db.close();
})();
