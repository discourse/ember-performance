"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");
const MergeTrees = require("broccoli-merge-trees");
const Concat = require("broccoli-concat");
const CopyIndex = require("./lib/copy-index");
const Funnel = require("broccoli-funnel");

const clientDepsTree = new Funnel("node_modules", {
  include: [
    "headjs/dist/1.0.0/head.js",
    "benchmark/benchmark.js",
    "rsvp/dist/rsvp.js",
    "ascii-table/ascii-table.js",
    "lodash/lodash.js",
  ],
});

const clientTree = new MergeTrees(["test-client", clientDepsTree], {
  annotation: "test-client merge",
});

const testClient = new Concat(clientTree, {
  headerFiles: [
    "test-client.js",
    "test-session.js",
    "headjs/dist/1.0.0/head.js",
    "lodash/lodash.js",
    "benchmark/benchmark.js",
    "rsvp/dist/rsvp.js",
    "ascii-table/ascii-table.js",
    "people.js",
  ],
  outputFile: "/assets/test-client.js",
});

const compileTemplatesTree = new Funnel("compile-templates", {
  include: ["index.{html,js}"],
  destDir: "compile-templates",
});

const benchmarksIndexJs = new Funnel("benchmarks", {
  include: ["**/*.js"],
  destDir: "benchmarks",
});

const benchmarksIndexHtml = new CopyIndex(benchmarksIndexJs, {
  annotation: "Copy index.html to benchmark",
});

const emberTree = new Funnel("ember", {
  include: ["**/*.js"],
  destDir: "ember",
});

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    "@embroider/macros": {
      setConfig: {
        "ember-qunit": {
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
          theme: "qunit-default",
        },
      },
    },
    fingerprint: {
      enabled: false,
    },
  });

  return new MergeTrees(
    [
      app.toTree(),
      testClient,
      compileTemplatesTree,
      benchmarksIndexJs,
      benchmarksIndexHtml,
      emberTree,
    ],
    {
      annotation: "final dist merge",
    },
  );
};
