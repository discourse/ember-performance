import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

export class BenchRoute extends Route {
  @service declare router: RouterService;

  // Placeholder
}
