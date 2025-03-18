import list from "./commands/list.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "snapshot":
    console.log("TODO: snapshot command");
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
