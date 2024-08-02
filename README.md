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

### License

MIT

### Adding a new app 

1. `cd app-at-version`
2. `npx ember-cli@6.0 new ember-6-0 --typescript --pnpm --skip-install --skip-git --embroider`
3. Add dependencies 
    ```bash
    pnpm add --save-dev @nullvoxpopuli/eslint-configs \
        common@workspace:^ ember-cli-utils@workspace:^ perf-testing@workspace:^ \
        ember-template-imports \
        prettier-plugin-ember-template-tag \
        ember-route-template  
    ```
4. Remove dependencies 
    ```bash 
    pnpm remove ember-data ember-fetch ember-cli-sri ember-cli-clean-css \
        stylelint stylelint-config-standard stylelint-prettier \
        ember-welcome-page \
        @types/ember-data @types/ember-data__adapter @types/ember-data__model \
        @types/ember-data__serializer @types/ember-data__store \
        @types/ember__application @types/ember__array \
        @types/ember_component @types/ember__controller \
        @types/ember_debug @types/ember_destroyable \
        @types/ember__engine @types/ember__error \
        @types/ember__helper @types/ember__modifier \
        @types/ember__object @types/ember_owner \
        @types/ember__polyfills @types/ember__routing \
        @types/ember__runloop @types/ember__service \
        @types/ember__string @types/ember__test \
        @types/ember__utils
    ```
5. Interactively update dependencies via `pnpm up -iL -r`
    `qunit-dom`, `ember-cli-app-version`, `ember-resolver`, etc (everything but eslint)
6. Add to `types/index.d.ts`:
    ```ts
    import 'ember-source/types';
    ```
7. Add to `config/environment.js`
    ```js
    const envUtils = require('ember-cli-utils/environment');

    // ...
    const ENV = {
      deps: envUtils.getDeps(__dirname),
      rootURL: '/ember-6-0/',
    }
    ```
8. Add to `ember-cli-build.js`    
    ```js
    module.exports = async function (defaults) {
      const utils = await import('ember-cli-utils');
      const app = new EmberApp(defaults, {
        // Add options here
        ...utils.configure(__dirname, ['common', 'perf-testing']),
      });
    ```
9. Add to `app/router.js` (or `app/router.ts`)
    ```js
    Router.map(function () {
      this.route('bench', { path: ':name' });
    });
    ```
10. Change the build scripts `package.json`. Delete `build` and add:
    ```
    "build:prod": "ember build --environment=production",
    "build:dev":  "ember build --environment=development",
    ```
    
