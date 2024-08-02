import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';

export default Route(
  <template>
    {{pageTitle "Ember 5.10"}}

    {{outlet}}
  </template>
);
