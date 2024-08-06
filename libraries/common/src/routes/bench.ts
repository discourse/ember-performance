import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

export default class Bench extends Route {
  @service declare router: RouterService;

  model({ name }) {
    console.log('bench', name, ...arguments);

    if (name === 'index.html') {
      this.router.transitionTo('application');
    }
  }
}
