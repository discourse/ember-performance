/* global head, Benchmark, TestSession, RSVP */

(function () {
  let MACRO_MAX_TIME = 15000;
  let MACRO_MIN_TIME = 2000;
  let MACRO_STOP_RME = 3.0;
  let MIN_SAMPLES = 5;

  /**
   * T-Distribution two-tailed critical values for 95% confidence
   * http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm
   */
  let tTable = {
    1: 12.706,
    2: 4.303,
    3: 3.182,
    4: 2.776,
    5: 2.571,
    6: 2.447,
    7: 2.365,
    8: 2.306,
    9: 2.262,
    10: 2.228,
    11: 2.201,
    12: 2.179,
    13: 2.16,
    14: 2.145,
    15: 2.131,
    16: 2.12,
    17: 2.11,
    18: 2.101,
    19: 2.093,
    20: 2.086,
    21: 2.08,
    22: 2.074,
    23: 2.069,
    24: 2.064,
    25: 2.06,
    26: 2.056,
    27: 2.052,
    28: 2.048,
    29: 2.045,
    30: 2.042,
    infinity: 1.96,
  };

  function K() {}

  function update(id, txt) {
    document.getElementById(id).innerText = txt;
  }

  // Use benchmark.js to run a microbenchmark
  function microBenchmark(test) {
    return new RSVP.Promise(function (resolve) {
      update("status-text", "Running Micro Benchmark...");

      setTimeout(function () {
        let suite = new Benchmark.Suite();

        suite.add(test.name, test.test, {
          setup: test.setup,
          distribution: test.distribution,
          teardown: test.teardown,
        });

        suite.on("cycle", function (evt) {
          test.reset();

          let r = evt.target;
          resolve({
            name: r.name,
            hz: r.hz,
            rme: r.stats.rme,
            deviation: r.stats.deviation,
            mean: r.stats.mean,
            samples: r.stats.sample.length,
            emberVersion: r.emberVersion,
            createdAt: new Date(),
          });
        });

        suite.on("error", function (evt) {
          let err = evt.target.error;
          update("status-text", "Error: " + err.message);
          throw err;
        });

        suite.run();
      }, 100);
    });
  }

  // Run a macro benchmark until our error threshold is low or our
  // MACRO_MAX_TIME expires
  function macroBenchmark(t) {
    return new RSVP.Promise(function (resolve) {
      update("status-text", "Running Benchmark...");

      let samples = [];
      let sum = 0;

      let resetPromise = t.reset();
      let result = { name: t.name };
      let startTime = new Date().getTime();

      let tester = function () {
        update("progress", "" + samples.length + " samples taken.");

        let t1 = new Date().getTime();

        RSVP.Promise.resolve(t.test()).then(function () {
          let elapsed = new Date().getTime() - t1,
            nextPromise = t.reset();

          sum += elapsed;
          samples.push(elapsed);

          result.mean = sum / samples.length;
          let squareSum = 0;
          for (let j = 0; j < samples.length; j++) {
            let diff = samples[j] - result.mean;
            squareSum += diff * diff;
          }
          result.deviation = squareSum / samples.length;
          let standardErr = result.deviation / Math.sqrt(samples.length),
            critical =
              tTable[Math.round(result.samples - 1) || 1] || tTable.infinity;

          result.rme = ((standardErr * critical) / result.mean) * 100 || 0;
          result.samples = samples.length;
          result.hz = 1000.0 / result.mean;

          let totalEllapsed = new Date().getTime() - startTime;

          let next = function () {
            // Loop until the min time is passed and the rme is low, or the max time ellapsed
            if (
              samples.length < MIN_SAMPLES ||
              ((totalEllapsed < MACRO_MIN_TIME ||
                result.rme > MACRO_STOP_RME) &&
                totalEllapsed < MACRO_MAX_TIME)
            ) {
              setTimeout(tester, 10);
            } else {
              resolve(result);
            }
          };

          if (nextPromise && nextPromise.then) {
            nextPromise.then(next);
          } else {
            next();
          }
        });
      };

      if (resetPromise && resetPromise.then) {
        resetPromise.then(function () {
          setTimeout(tester, 10);
        });
      } else {
        setTimeout(tester, 10);
      }
    });
  }

  function TestClient(test) {
    this.name = test.name;
    this.options = test;

    this.setup = test.setup || K;
    this.reset = test.reset || K; // remove this in-favour of teardown
    this.test = test.test || K;
    this.teardown = test.teardown || function () {};

    this.noEmber = test.noEmber;
  }

  TestClient.run = function (test) {
    let session = TestSession.recover();
    if (session.enableProfile) {
      buildProfileClient(this, test).start();
    } else {
      new this(test).start();
    }
  };

  TestClient.prototype = {
    template: function (templateName) {
      let compiled = this.session.getCompiledTemplate(templateName);
      let template = JSON.parse(compiled);
      return require("@ember/-internals/glimmer").template(template);
    },

    updateTitle: function () {
      document.title = this.name;
      update("test-title", this.name);
    },

    run: function () {
      return macroBenchmark(this, this.testItem);
    },

    profile: function () {
      let test = this;

      return new RSVP.Promise(function (resolve) {
        // Why on earth do we reset before we run?, must be a mistake?
        let resetPromise = test.reset();

        let tester = function () {
          let result = test.test();

          if (typeof result === "object" && typeof result.then === "function") {
            // we should chain these promises correctly
            RSVP.Promise.resolve(result).then(function () {
              resolve({ skipRedirect: true });
            });
          } else {
            resolve({ skipRedirect: true });
          }
        };

        if (resetPromise && resetPromise.then) {
          resetPromise.then(function () {
            setTimeout(tester, 10);
          });
        } else {
          setTimeout(tester, 10);
        }
      });
    },

    recoverSession: function () {
      let session = (this.session = TestSession.recover());
      let testGroup = session.currentTestGroup();

      if (session) {
        this.testItem = session.currentTestItem();

        update(
          "remaining-text",
          session.remainingTestCount() + " test(s) remaining",
        );
        this.emberUrl = testGroup.emberVersion.path;
        update("ember-version", testGroup.emberVersion.name);
      } else {
        this.emberUrl = "/ember/1.8.1.js";
      }
    },

    start: function () {
      update("status-text", "Loading...");
      this.recoverSession();

      let deps = [];

      if (!this.noEmber) {
        if (
          this.session &&
          this.session.featureFlags &&
          this.session.featureFlags.length
        ) {
          let features = {};
          this.session.featureFlags.forEach(function (f) {
            features[f] = true;
          });
          window.EmberENV = {
            FEATURES: features,
          };
        }

        deps = ["/ember/jquery-2.1.1.min.js", this.emberUrl];
      }

      let test = this;

      // Once the test completes
      let complete = function (result) {
        test.testItem.result = result;
        test.session.progress();
        test.session.goToNextUrl();
      };

      let patchModules = () => {
        if (this.noEmber) {
          return;
        }
        try {
          require("@ember/object");
        } catch {
          /* eslint-disable ember/new-module-imports */
          /* global Ember */

          // Non-exhaustive polyfill based on https://github.com/ember-cli/ember-rfc176-data
          // This allows us to use the `require`-based syntax, even on older ember versions
          define("@ember/object", ["exports"], function (_exports) {
            _exports.computed = Ember.computed;
            _exports.default = Ember.Object;
          });
          define("@ember/component", ["exports"], function (_exports) {
            _exports.default = Ember.Component;
          });
          define("@ember/controller", ["exports"], function (_exports) {
            _exports.default = Ember.Controller;
          });
          define("@ember/application", ["exports"], function (_exports) {
            _exports.default = Ember.Application;
          });
          define("@ember/runloop", ["exports"], function (_exports) {
            _exports.run = Ember.run;
            _exports.schedule = Ember.run.schedule;
          });
          define("@ember/string", ["exports"], function (_exports) {
            _exports.classify = Ember.String.classify;
          });
          define("@ember/-internals/glimmer", ["exports"], function (_exports) {
            _exports.template = Ember.Handlebars.template;
          });
          define("ember", ["exports"], function (_exports) {
            _exports.default = Ember;
          });

          /* eslint-enable ember/new-module-imports */
        }
      };

      // What to run when our dependencies have loaded
      let runner = function () {
        patchModules();
        RSVP.Promise.resolve(test.setup())
          .then(function () {
            return test.run();
          })
          .then(complete)
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          });
      };

      if (deps.length) {
        head.load(deps, runner);
      } else {
        runner();
      }
    },
  };

  window.TestClient = TestClient;

  function MicroTestClient(test) {
    TestClient.call(this, test);
  }

  MicroTestClient.run = TestClient.run;

  MicroTestClient.prototype = Object.create(TestClient.prototype);
  MicroTestClient.prototype.run = function () {
    return microBenchmark(this);
  };

  MicroTestClient.prototype.profile = function () {
    let setup = functionToString(this.setup);
    let test = functionToString(this.test);
    let teardown = functionToString(this.teardown);

    let functionSpec =
      "" +
      setup +
      "\n" +
      'console.profile("' +
      this.name +
      '");\n' +
      test +
      "\n" +
      "console.profileEnd();\n" +
      teardown +
      "\n";

    let run = new Function(functionSpec);

    return new RSVP.Promise(function (resolve) {
      setTimeout(function () {
        run();
        resolve({
          skipRedirect: true,
        });
      }, 10);
    });
  };

  window.MicroTestClient = MicroTestClient;

  function buildProfileClient(Klass, test) {
    let runner = new Klass(test);
    runner.run = runner.profile;
    return runner;
  }

  function functionToString(fn) {
    let string = fn.toString();
    string = (/^[^{]+\{([\s\S]*)}\s*$/.exec(string) || 0)[1];
    string = (string || "").replace(/^\s+|\s+$/g, "");
    return string;
  }

  function RenderTemplateTestClient(test) {
    TestClient.call(this, test);
  }

  RenderTemplateTestClient.run = TestClient.run;
  RenderTemplateTestClient.prototype = Object.create(TestClient.prototype);

  RenderTemplateTestClient.prototype.setupTemplateTest = function (
    templateName,
    data,
    { componentMode = "classic" } = {},
  ) {
    require("ember").default;
    const Application = require("@ember/application").default;
    const Resolver = require("ember-resolver").default;
    const Controller = require("@ember/controller").default;
    const run = require("@ember/runloop").run;

    this.app = Application.create({
      rootElement: "#scratch",
      Resolver,
      modulePrefix: "scratch-app",
    });
    this.app.deferReadiness();

    this.registry = this.app.__registry__ || this.app.registry;

    this.registry.register("controller:index", Controller.extend());
    this.registry.register("template:index", this.template("base"));
    this.registry.register(
      "template:components/benchmarked-component",
      this.template(templateName),
    );

    if (componentMode === "classic") {
      const ClassicComponent = require("@ember/component").default;
      this.registry.register(
        "component:benchmarked-component",
        ClassicComponent.extend({}),
      );
    } else if (componentMode === "glimmer") {
      const GlimmerComponent = require("@glimmer/component").default;
      this.registry.register(
        "component:benchmarked-component",
        class extends GlimmerComponent {},
      );
    } else if (componentMode === "glimmer-template-only") {
      // Glimmer template-only - no need to register anything
    } else {
      throw `Unknown componentMode passed to setupTemplateTest: '${componentMode}'`;
    }

    run(this.app, "advanceReadiness");

    this.controller = this.app.__container__.lookup("controller:index");
    this.controller.set("data", data);
  };

  RenderTemplateTestClient.prototype.hideComponent = function () {
    require("@ember/runloop").run(this, function () {
      this.controller.set("showContents", false);
    });
  };

  RenderTemplateTestClient.prototype.showComponent = function () {
    require("@ember/runloop").run(this, function () {
      this.controller.set("showContents", true);
    });
  };

  window.RenderTemplateTestClient = RenderTemplateTestClient;
})();
