import { getPackages } from '@manypkg/get-packages';
import fs from 'node:fs';
import path from 'node:path';
import { packageJson } from 'ember-apply';

const CWD = process.cwd();
const result = await getPackages(CWD);

async function linkWorkspacePackages(pkg) {
  let manifest = pkg.packageJson;

  if (['common', 'perf-testing'].includes(manifest.name)) {
    await packageJson.removeDependencies(['common', 'perf-testing'], pkg.dir);
    return;
  }

  await packageJson.addDependencies(
    {
      common: 'workspace:^',
      'perf-testing': 'workspace:^',
    },
    pkg.dir
  );
}

async function fixLinting(pkg) {
  await packageJson.addDevDependencies(
    {
      'eslint-plugin-ember': '^12.1.1',
      'ember-template-lint': '^6.0.0',
      'qunit-dom': '^3.2.0',
      '@nullvoxpopuli/eslint-configs': '^4.0.0',
      prettier: '3.3.3',
      'prettier-plugin-ember-template-tag': '2.0.2',
      '@typescript-eslint/parser': '8.0.0',
      '@typescript-eslint/eslint-plugin': '8.0.0',
      typescript: '5.5.4',
      '@glint/core': '1.4.0',
      '@glint/template': '1.4.0',
      '@glint/environment-ember-loose': '1.4.0',
      '@glint/environment-ember-template-imports': '1.4.0',
    },
    pkg.dir
  );

  let oldESLint = path.join(pkg.dir, '.eslintrc.js');

  if (fs.existsSync(oldESLint)) {
    fs.unlinkSync(oldESLint);
  }

  let newESLint = path.join(pkg.dir, '.eslintrc.cjs');
  if (!fs.existsSync(newESLint)) {
    fs.writeFileSync(
      newESLint,
      `'use strict'
      const { configs } = require('@nullvoxpopuli/eslint-configs');

      // accommodates: JS, TS, App, Addon, and V2 Addon
      module.exports = configs.ember();
      `
    );
  }

  let oldPrettier = path.join(pkg.dir, '.prettierrc.js');

  if (fs.existsSync(oldPrettier)) {
    fs.unlinkSync(oldPrettier);
  }

  fs.writeFileSync(
    path.join(pkg.dir, '.prettierrc.cjs'),
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
  `
  );
}

async function addTS(pkg) {
  let tsConfigPath = path.join(pkg.dir, 'tsconfig.json');
  await packageJson.addDevDependencies(
    {
      '@tsconfig/ember': '3.0.8',
    },
    pkg.dir
  );

  if (pkg.packageJson.devDependencies['rollup']) {
    fs.writeFileSync(
      tsConfigPath,
      `
{
  "extends": "@tsconfig/ember/tsconfig.json",
  "include": [
    "src/**/*",
    "unpublished-development-types/**/*"
  ],
  "glint": {
    "environment": ["ember-loose", "ember-template-imports"]
  },
  "compilerOptions": {
    "allowJs": true,
    "declarationDir": "declarations",
    /**
      https://www.typescriptlang.org/tsconfig#noEmit

      We want to emit declarations, so this option must be set to \`false\`.
      @tsconfig/ember sets this to \`true\`, which is incompatible with our need to set \`emitDeclarationOnly\`.
      @tsconfig/ember is more optimized for apps, which wouldn't emit anything, only type check.
    */
    "noEmit": false,
    /**
      https://www.typescriptlang.org/tsconfig#emitDeclarationOnly
      We want to only emit declarations as we use Rollup to emit JavaScript.
    */
    "emitDeclarationOnly": true,

    /**
      https://www.typescriptlang.org/tsconfig#noEmitOnError
      Do not block emit on TS errors.
    */
    "noEmitOnError": false,

    /**
      https://www.typescriptlang.org/tsconfig#rootDir
      "Default: The longest common path of all non-declaration input files."

      Because we want our declarations' structure to match our rollup output,
      we need this "rootDir" to match the "srcDir" in the rollup.config.mjs.

      This way, we can have simpler \`package.json#exports\` that matches
      imports to files on disk
    */
    "rootDir": "./src",

    /**
      https://www.typescriptlang.org/tsconfig#allowImportingTsExtensions

      We want our tooling to know how to resolve our custom files so the appropriate plugins
      can do the proper transformations on those files.
    */
    "allowImportingTsExtensions": true
  }
}
`
    );
  } else {
    fs.writeFileSync(
      tsConfigPath,
      `
{
  "extends": "@tsconfig/ember/tsconfig.json",
  "glint": {
    "environment": ["ember-loose", "ember-template-imports"]
  },
  "compilerOptions": {
    "lib": ["DOM", "ES2023"],
    "declaration": false,
    // temporary until ember gets the glimmer-vm upgrade
    "skipLibCheck": true,
    "paths": {
      "${pkg.packageJson.name}/tests/*": ["tests/*"],
      "${pkg.packageJson.name}/*": ["app/*"],
      "*": ["types/*"]
    }
  },
  "include": ["app/**/*", "tests/**/*", "types/**/*"]
}
`
    );
  }
}

for (let pkg of result.packages) {
  await linkWorkspacePackages(pkg);
  await fixLinting(pkg);
  await addTS(pkg);
}
