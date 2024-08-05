'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const utils = await import('ember-cli-utils');
  const config = await utils.configure(__dirname, ['common']);

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
