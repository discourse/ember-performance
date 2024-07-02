import { tracked } from "@glimmer/tracking";
import Controller from "@ember/controller";
import { action, set } from "@ember/object";
import { empty, filterBy, or } from "@ember/object/computed";

export default class IndexController extends Controller {
  @tracked emberVersions;
  @tracked report = null;
  @tracked sending = false;
  @tracked error = false;
  @tracked sent = false;
  @tracked featureFlags = null;
  @tracked newFlagName = null;

  @filterBy("model", "isEnabled", true) enabledTests;
  @filterBy("emberVersions", "isEnabled", true) enabledEmberVersions;
  @filterBy("emberVersions", "isCustom", false) nonCustomEmberVersions;
  @empty("newFlagName") addFeatureDisabled;
  @empty("enabledTests") hasNoEnabledTests;
  @empty("enabledEmberVersions") hasNoEnabledEmberVersions;
  @or("hasNoEnabledTests", "hasNoEnabledEmberVersions") cantStart;

  get customEmberVersion() {
    return this.emberVersions[this.emberVersions.length - 1];
  }

  run(options = {}) {
    let enabledEmberVersions = this.enabledEmberVersions;
    let enabledTests = this.enabledTests;

    // Remember any custom urls we set for another run
    let customEmberVersion = this.customEmberVersion;
    if (customEmberVersion.isEnabled) {
      localStorage.setItem("ember-perf-ember-url", customEmberVersion.path);
      localStorage.setItem(
        "ember-perf-compiler-url",
        customEmberVersion.compilerPath,
      );
    } else {
      localStorage.removeItem("ember-perf-ember-url");
      localStorage.removeItem("ember-perf-compiler-url");
    }

    localStorage.setItem("ember-perf-flags", JSON.stringify(this.featureFlags));

    let testSession = new window.TestSession();

    testSession.setup(enabledEmberVersions, enabledTests);
    testSession.featureFlags = this.featureFlags;
    testSession.enableProfile = options.enableProfile || false;
    testSession.save();

    testSession.goToNextUrl();
  }

  @action
  profile() {
    this.run({ enableProfile: true });
  }

  @action
  start() {
    this.run();
  }

  @action
  selectAllTests() {
    this.model.forEach((t) => set(t, "isEnabled", true));
  }

  @action
  selectNoTests() {
    this.model.forEach((t) => set(t, "isEnabled", false));
  }

  @action
  selectAllVersions() {
    this.nonCustomEmberVersions.forEach((v) => set(v, "isEnabled", true));
  }

  @action
  selectNoVersions() {
    this.nonCustomEmberVersions.forEach((v) => set(v, "isEnabled", false));
  }

  @action
  addFeature() {
    let f = this.newFlagName;

    if (f && f.length) {
      if (!this.featureFlags.includes(this.newFlagName)) {
        this.featureFlags.push(this.newFlagName);
      }
      this.newFlagName = "";
    }
  }

  @action
  removeFeature(featureFlag) {
    const ffIndex = this.featureFlags.indexOf(featureFlag);

    if (ffIndex === -1) {
      return;
    }

    this.featureFlags.splice(ffIndex, 1);
  }
}
