'use strict';

const path = require('path');
const fs = require('fs');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const utils = await import('ember-cli-utils');
  const config = await utils.configure(__dirname, [
    'common',
    'ember-5-10',
    'ember-5-9',
    'ember-5-8',
    'ember-5-7',
    'ember-5-6',
    'ember-5-5',
    'ember-4-0',
    'ember-3-28',
  ]);

  console.info(`
    Once per boot, we copy the dist directories from ../app-at-version into our public folder so that we can load those other apps.
  `);

  for (let appFolderName of fs.readdirSync('../app-at-version')) {
    let distFolder = path.join('../app-at-version', appFolderName, 'dist');

    if (!fs.existsSync(distFolder)) {
      console.warn(`${distFolder} doesn't exist. Skipping.`);

      continue;
    }

    let target = path.join('./public', appFolderName);

    fs.mkdirSync(target, { recursive: true });
    fs.cpSync(distFolder, target, { recursive: true });
  }

  const app = new EmberApp(defaults, {
    ...config,
    '@embroider/macros': {
      setConfig: {
        'ember-qunit': {
          /**
           * default: false
           *
           * removes the CSS for the test-container (where the app and components are rendered to)
           */
          disableContainerStyles: true,
          /**
           * default: 'qunit-default'
           * options: 'qunit-default' | 'ember'
           *
           * Sets the theme for the Web UI of the test runner. Use a different value to disable loading any theme, allowing you to provide your own external one.
           */
          theme: 'qunit-default',
        },
      },
    },
  });

  const { Webpack } = require('@embroider/webpack');

  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        devtool: 'source-map',
      },
    },
  });
};
