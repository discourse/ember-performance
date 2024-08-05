import { pageTitle } from 'ember-page-title';
import RouteTemplate from 'ember-route-template';

export default RouteTemplate(
  <template>
    {{pageTitle "Ember Performance Benchmarks"}}

    <div class="container">
      <h3 class="text-muted">Ember Performance</h3>

      {{outlet}}
    </div>
  </template>
);
