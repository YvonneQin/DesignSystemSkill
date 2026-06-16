#!/usr/bin/env node
/**
 * Full Base refresh: Ant Design palettes + uniform ramps with per-palette anchors.
 *
 * Usage: node scripts/tokens/refresh-base-palettes.js [path/to/default.json]
 */

const { execSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const defaultPath = process.argv[2] || "";

const run = (script) => {
  const cmd = defaultPath
    ? `node ${path.join(ROOT, script)} ${defaultPath}`
    : `node ${path.join(ROOT, script)}`;
  execSync(cmd, { stdio: "inherit", cwd: ROOT });
};

run("scripts/tokens/apply-default-base.js");
run("scripts/tokens/uniformize-base-palettes.js");
run("scripts/tokens/build-theme.js");

console.log("\nBase refresh complete.");
