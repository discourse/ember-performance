import Component from '@glimmer/component';
import { LinkTo } from '@ember/routing';
import { inject as service } from '@ember/service';

import Route from 'ember-route-template';

import { scenarios } from '../scenarios.ts';

import type ForAppVersion from '../services/runner/for-app-at-version.ts';

function get(name: string) {
  return scenarios[name];
}

class Index extends Component<{ Args: { model: { name: string } } }> {
  @service('runner/for-app-at-version') declare forApp: ForAppVersion;

  <template>
    <LinkTo @route="index">🠰 Benchmark List</LinkTo>

    {{#let (get @model.name) as |Scenario|}}
      <Scenario @version={{this.forApp.emberVersion}} />
    {{/let}}
  </template>
}

export default Route(Index);
