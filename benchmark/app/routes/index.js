import Route from "@ember/routing/route";

import config from "ember-performance/config/environment";
import { TrackedArray } from "tracked-built-ins";

const BENCHMARKS = config.BENCHMARKS;

const EMBER_VERSIONS = config.LOCAL_EMBER_VERSIONS.map((version) => {
  return {
    name: version,
    path: `/ember/ember-${version}.prod.js`,
    compilerPath: `/ember/ember-${version}.template-compiler.js`,
    isEnabled: false,
    isCustom: false,
  };
});

EMBER_VERSIONS[EMBER_VERSIONS.length - 1].isEnabled = true;

EMBER_VERSIONS.push({
  name: "custom version",
  path: "",
  compilerPath: "",
  isEnabled: false,
  isCustom: true,
});

export default class IndexRoute extends Route {
  model() {
    let session = window.TestSession.recover();

    let tests = BENCHMARKS.map((test) => {
      if (session) {
        test.isEnabled = session.isTestEnabled(test);
      } else {
        test.isEnabled = true;
      }

      return test;
    });

    let emberVersions = EMBER_VERSIONS.map((emberVersion) => {
      if (session) {
        emberVersion.isEnabled = session.isVersionEnabled(emberVersion);
      }

      if (emberVersion.isCustom) {
        emberVersion.path = localStorage.getItem("ember-perf-ember-url");
        emberVersion.compilerPath = localStorage.getItem(
          "ember-perf-compiler-url",
        );
      }

      return emberVersion;
    });

    return {
      tests,
      emberVersions,
      session,
    };
  }

  setupController(controller, model) {
    let session = model.session;
    let report;

    if (session) {
      report = session.getReport();
    }

    let featureFlags = [];
    let flagsJson = localStorage.getItem("ember-perf-flags");

    if (flagsJson && flagsJson.length) {
      featureFlags = JSON.parse(flagsJson);
    }

    controller.setProperties({
      model: model.tests,
      session,
      report,
      emberVersions: model.emberVersions,
      featureFlags: new TrackedArray(featureFlags),
    });
  }
}
