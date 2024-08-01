import Route from "ember-route-template";
import { pageTitle } from "ember-page-title";
import { scenarios } from 'common';

export default Route(
  <template>
    {{pageTitle "Ember 5.10"}}


    {{outlet}}

  </template>
)
