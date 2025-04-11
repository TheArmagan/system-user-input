const { build } = require("esbuild");
const cp = require("child_process");
const fs = require("fs");
const path = require("path");

(async () => {
  console.time("Build time");
  await build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    minify: true,
    external: [
      "electron",
    ],
    platform: "node",
  });
  console.timeEnd("Build time");

  fs.readdirSync("./bin").forEach((file) => {
    fs.copyFileSync(path.join("./bin", file), path.join("./dist", file));
    console.log(`Copied ${file} to dist`);
  });

  console.log("Build complete");
})();