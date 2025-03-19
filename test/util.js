import fs from "fs/promises";
import path from "path";

export const compareDirectories = async (dir1, dir2) => {
  const files1 = await fs.readdir(dir1);
  const files2 = await fs.readdir(dir2);

  expect(files1).toEqual(files2);

  for (const file of files1) {
    const filePath1 = path.join(dir1, file);
    const filePath2 = path.join(dir2, file);

    const stat1 = await fs.lstat(filePath1);
    const stat2 = await fs.lstat(filePath2);

    expect(stat1.isDirectory()).toBe(stat2.isDirectory());

    if (stat1.isDirectory()) {
      await compareDirectories(filePath1, filePath2);
      continue;
    }

    const contents1 = await fs.readFile(filePath1, "hex");
    const contents2 = await fs.readFile(filePath2, "hex");

    expect(contents1).toBe(contents2);
  }
};
