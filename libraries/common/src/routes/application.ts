import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';

export default class Application extends Route {
  @service declare router: RouterService;

  queryParams = {
    run: { refreshModel: false },
  };

  model() {
    console.log('before model running');
    window.addEventListener('message', (e) => {
      console.log(e);
      if (typeof e.data !== 'string') return;

      let parsed;

      try {
        parsed = JSON.parse(e.data);
      } catch {
        return;
      }

      if (!Array.isArray(parsed)) return;

      let [command, arg] = parsed;

      if (command === 'run') {
        this.router.transitionTo('bench', arg);
      }
    });
  }
}
