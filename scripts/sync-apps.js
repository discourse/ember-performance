import { getPackages } from "@manypkg/get-packages";
import fs from "node:fs";
import path from "node:path";
import { packageJson } from "ember-apply";

const CWD = process.cwd();
const result = await getPackages(CWD);

async function linkWorkspacePackages(pkg) {
  let manifest = pkg.packageJson;

  if (["common", "perf-testing"].includes(manifest.name)) {
    await packageJson.removeDependencies(["common", "perf-testing"], pkg.dir);
    return;
  }

  await packageJson.addDependencies(
    {
      common: "workspace:^",
      "perf-testing": "workspace:^",
    },
    pkg.dir,
  );
}

async function fixLinting(pkg) {
  await packageJson.addDevDependencies(
    {
      "@nullvoxpopuli/eslint-configs": "^4.0.0",
      prettier: "3.3.3",
      "prettier-plugin-ember-template-tag": "2.0.2",
    },
    pkg.dir,
  );

  let oldESLint = path.join(pkg.dir, ".eslintrc.js");

  if (fs.existsSync(oldESLint)) {
    fs.unlinkSync(oldESLint);
  }

  fs.writeFileSync(
    path.join(pkg.dir, ".eslintrc.cjs"),
    `'use strict'
      const { configs } = require('@nullvoxpopuli/eslint-configs');

      // accommodates: JS, TS, App, Addon, and V2 Addon
      module.exports = configs.ember();
      `,
  );

  let oldPrettier = path.join(pkg.dir, ".prettierrc.js");

  if (fs.existsSync(oldPrettier)) {
    fs.unlinkSync(oldPrettier);
  }

  fs.writeFileSync(
    path.join(pkg.dir, ".prettierrc.cjs"),
    `
'use strict';

module.exports = {
  printWidth: 100,
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      // Lol, JavaScript
      files: ['*.js', '*.ts', '*.cjs', '.mjs', '.cts', '.mts', '.cts'],
      options: {
        singleQuote: true,
        trailingComma: 'es5',
      },
    },
    {
      files: ['*.json'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.hbs'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: ['*.gjs', '*.gts'],
      options: {
        parser: 'ember-template-tag',
        singleQuote: true,
        templateSingleQuote: false,
        trailingComma: 'es5',
      },
    },
  ],
};
  `,
  );
}

for (let pkg of result.packages) {
  await linkWorkspacePackages(pkg);
  await fixLinting(pkg);
}
