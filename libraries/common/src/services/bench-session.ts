import { tracked } from '@glimmer/tracking';
import Service from '@ember/service';

import { TrackedSet } from 'tracked-built-ins';

interface UISettings {
  enabled: {
    emberVersions: string[];
    scenarios: string[];
  };
}

const STORAGE_KEY = 'bench_ui_state';

export default class BenchSession extends Service {
  @tracked enabledEmberVersions = new TrackedSet();
  @tracked enabledScenarios = new TrackedSet();

  recover = () => {
    let state = readFromLocalStorage();

    if (!state) return;

    this.enabledScenarios = new TrackedSet(state.enabled.scenarios);
    this.enabledEmberVersions = new TrackedSet(state.enabled.emberVersions);
  };
}

function readFromLocalStorage(): UISettings | undefined {
  let state = localStorage.getItem(STORAGE_KEY);

  if (!state) return;

  try {
    return JSON.parse(state);
  } catch (e) {
    console.error(e);

    return;
  }
}
