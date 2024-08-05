import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class Application extends Route {
  @service router;

  queryParams = {
    run: { refreshModel: false },
  };

  beforeModel() {
    window.addEventListener('message', (e) => {
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
