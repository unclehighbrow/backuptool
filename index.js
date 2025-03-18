import _db from "./db.js";
import list from "./commands/list.js";
import snapshot from "./commands/snapshot.js";
import restore from "./commands/restore.js";

(async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  const db = await _db();

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
      const snapshotId = args[1];
      if (!snapshotId) {
        console.error("Please provide a snapshot ID");
        process.exit(1);
      }
      const outputDirectory = args[2];
      if (!outputDirectory) {
        console.error("Please provide an output directory");
        process.exit(1);
      }
      await restore(db, snapshotId, outputDirectory);
      break;
    case "prune":
      console.log("TODO: prune command");
      break;
    case "list":
      await list(db);
      break;
    default:
      console.error("Unknown command");
      process.exit(1);
  }

  await db.end();
})();
