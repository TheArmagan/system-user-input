const fs = require("fs");
const cp = require("child_process");
const path = require("path");

if (fs.existsSync("./dist")) fs.rmSync("./dist", { recursive: true, force: true });
console.time("Build time");
cp.execSync("pnpm run tsc", { stdio: "inherit" });
console.timeEnd("Build time");

fs.readdirSync("./bin").forEach((file) => {
  fs.copyFileSync(path.join("./bin", file), path.join("./dist", file));
  console.log(`Copied ${file} to dist`);
});

console.log("Build complete");