### Ember Performance Suite

The Ember Performance Suite is designed to help profile and diagnose
the performance of the Ember.js framework. The general strategy is:

- Browsers have a large variance in performance characteristics, so
  run each test in a new document, storing the results in localStorage.

- Use benchmark.js for micro benchmarks and a different strategy for
  macro benchmarks.

- Record Baseline performance so that we can compare Ember to the
  baseline performance of the platform it's run on.

### bench.json

* name: humanized name
* description: TL;DR of the benchmark, sometimes notes can be handy to display
* keywords: these are meant to label/categorize tests, allowing tooling and users to quickly group and differentiate
* disabled: allows for a test to be entirely disabled

### To run in development mode

1. `npm install`
2. `npm start`
3. `Open http://localhost:4200`

### To build for production mode

1. `npm install`
2. `npm run build`

And open a browser to http://localhost:4200

### Updating Ember version bundles

To add a new ember version, update the version list in  `scripts/build-ember-assets.js`, and run it. It will generate appropriately named js files under `ember/`.

### License

MIT
