#! /usr/bin/env node
/* eslint-disable no-console */

const { execSync } = require("child_process");
const os = require("os");
const path = require("path");
const fs = require("fs");
const semver = require("semver");

const versions = [
  "3.28.8",
  "4.0.1",
  "5.5.0",
  "5.6.0",
  "5.7.0",
  "5.8.0",
  "5.9.0",
  "5.10.0",
];

const emberPerformanceDir = path.resolve(__dirname, "../ember");

// Delete all files in emberPerformanceDir starting with "ember-"
fs.readdirSync(emberPerformanceDir).forEach((file) => {
  if (file.startsWith("ember-")) {
    fs.unlinkSync(path.join(emberPerformanceDir, file));
  }
});

versions.forEach((version) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ember-"));
  const appDir = path.join(tempDir, "myapp");

  try {
    console.log(`Setting up Ember ${version} in ${tempDir}`);

    let emberCliVersion = "5.4.0";

    // Use older ember-cli for Ember 3.x compatibility
    if (semver.lt(version, "4.0.0")) {
      emberCliVersion = "4.12.3";
    }

    execSync(
      `npx --yes ember-cli@${emberCliVersion} new myapp --skip-npm --skip-git`,
      {
        cwd: tempDir,
        stdio: "inherit",
      },
    );
    execSync("pnpm install", {
      cwd: appDir,
      stdio: "inherit",
    });
    execSync(`pnpm add -D ember-source@${version}`, {
      cwd: appDir,
      stdio: "inherit",
    });

    execSync(`pnpm build`, { cwd: appDir, stdio: "inherit" });

    const distDir = path.join(appDir, "dist", "assets");
    const vendorFile = fs
      .readdirSync(distDir)
      .find((file) => file.startsWith("vendor-") && file.endsWith(".js"));
    const vendorFilePath = path.join(distDir, vendorFile);

    const emberSourceDir = path.join(
      appDir,
      "node_modules",
      "ember-source",
      "dist",
    );
    const templateCompilerFilePath = path.join(
      emberSourceDir,
      "ember-template-compiler.js",
    );

    fs.copyFileSync(
      vendorFilePath,
      path.join(emberPerformanceDir, `ember-${version}.prod.js`),
    );
    fs.copyFileSync(
      templateCompilerFilePath,
      path.join(emberPerformanceDir, `ember-${version}.template-compiler.js`),
    );

    console.log(`Ember ${version} setup complete.`);
  } finally {
    fs.rmSync(tempDir, { recursive: true });
  }
});
