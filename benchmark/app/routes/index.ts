import Route from '@ember/routing/route';
import { service } from '@ember/service';

import type { BenchSession } from 'common';

export default class IndexRoute extends Route {
  @service declare benchSession: BenchSession;

  model() {
    this.benchSession.recover();
  }
}
