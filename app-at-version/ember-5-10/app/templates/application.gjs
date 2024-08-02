import { scenarios } from 'common';
import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';

// eslint-disable-next-line
console.log(scenarios);

export default Route(
  <template>
    {{pageTitle "Ember 5.10"}}

    {{outlet}}
  </template>
);
