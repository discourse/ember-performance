import Route from '@ember/routing/route';
import { service } from '@ember/service';

import ENV from 'ember-performance/config/environment';

import type { BenchSession } from 'common';

export default class Application extends Route {
  @service declare benchSession: BenchSession;

  queryParams = {
    emberVersions: { refreshModel: false },
    benchmarks: { refreshModel: false },
    clear: { refreshModel: false },
    randomize: { refreshModel: false },
  };

  beforeModel() {
    this.benchSession.setup({
      emberVersions: ENV.LOCAL_EMBER_VERSIONS,
    });
  }
}
