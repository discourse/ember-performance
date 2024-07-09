#! /usr/bin/env node
/* eslint-disable no-console */

const { execSync } = require("child_process");
const os = require("os");
const path = require("path");
const fs = require("fs");
const semver = require("semver");

const versions = [
  "git:a474b88f", // Post-release version bump
  "git:a4359032", // Merge pull request #20681 from emberjs/update-babel
  "git:f9cfada9", // Merge pull request #20683 from emberjs/cleanup-app-wrapper
  "git:aa913464", // Merge pull request #20685 from emberjs/cleanup-template-only-feature
  "git:5c8df04a", // Merge pull request #20660 from NullVoxPopuli/deprecate-template-lookup
  "git:12f617ec", // Merge pull request #20688 from emberjs/tidy
  "git:53b2de8e", // Merge pull request #20675 from emberjs/build-reform
  "git:fbe87383", // Merge pull request #20686 from NullVoxPopuli/deprecate-import-ember-from-ember
  "git:438ff67e", // Merge pull request #20704 from bertdeblock/remove-component-suffix
  "git:756f0e3f", // Merge pull request #20702 from simonihmig/array-prototype-deprecation
  "git:3daeddda", // Add v5.10.0 to CHANGELOG
];

const emberPerformanceDir = path.resolve(__dirname, "../ember");

// Delete all files in emberPerformanceDir starting with "ember-"
fs.readdirSync(emberPerformanceDir).forEach((file) => {
  if (file.startsWith("ember-")) {
    fs.unlinkSync(path.join(emberPerformanceDir, file));
  }
});

versions.forEach((version, index) => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "ember-"));
  const appDir = path.join(tempDir, "myapp");

  let emberSourceTempDir = null;

  try {
    console.log(`Setting up Ember ${version} in ${tempDir}`);

    let emberCliVersion = "5.4.0";

    // Use older ember-cli for Ember 3.x compatibility
    if (semver.valid(version) && semver.lt(version, "4.0.0")) {
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

    if (version.startsWith("git:")) {
      const commitHash = version.split(":")[1];
      emberSourceTempDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "ember-source-"),
      );

      // Clone the ember.js repository and checkout the specified commit
      execSync(
        `git clone https://github.com/emberjs/ember.js.git ${emberSourceTempDir}`,
        { stdio: "inherit" },
      );
      execSync(`git checkout ${commitHash}`, {
        cwd: emberSourceTempDir,
        stdio: "inherit",
      });

      // Install dependencies and build the ember-source
      execSync("pnpm install", { cwd: emberSourceTempDir, stdio: "inherit" });
      execSync("pnpm build", { cwd: emberSourceTempDir, stdio: "inherit" });

      // Link the built ember-source to the app
      execSync(`pnpm link ${emberSourceTempDir}`, {
        cwd: appDir,
        stdio: "inherit",
      });
    } else {
      execSync(`pnpm add -D ember-source@${version}`, {
        cwd: appDir,
        stdio: "inherit",
      });
    }

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

    const versionId = `${index.toString().padStart(2, "0")}-${version.replace("git:", "")}`;

    fs.copyFileSync(
      vendorFilePath,
      path.join(emberPerformanceDir, `ember-${versionId}.prod.js`),
    );
    fs.copyFileSync(
      templateCompilerFilePath,
      path.join(emberPerformanceDir, `ember-${versionId}.template-compiler.js`),
    );

    console.log(`Ember ${version} setup complete.`);
  } finally {
    fs.rmSync(tempDir, { recursive: true });
    if (emberSourceTempDir) {
      fs.rmSync(emberSourceTempDir, { recursive: true });
    }
  }
});
