import list from "./commands/list.js";
import snapshot from "./commands/snapshot.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "snapshot":
    const directoryName = args[1];
    if (!directoryName) {
      console.error("Please provide a directory name");
      process.exit(1);
    }
    snapshot(directoryName);
    break;
  case "restore":
    console.log("TODO: restore command");
    break;
  case "prune":
    console.log("TODO: prune command");
    break;
  case "list":
    list();
    break;
  default:
    console.error("Unknown command");
    process.exit(1);
}
