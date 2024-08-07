import { LinkTo } from '@ember/routing';

import Route from 'ember-route-template';

import { scenarios } from '../scenarios.ts';

function get(name: string) {
  return scenarios[name];
}

export default Route<{ Args: { model: { name: string } } }>(
  <template>
    <LinkTo @route="index">🠰 Benchmark List</LinkTo>

    {{#let (get @model.name) as |Scenario|}}
      <Scenario />
    {{/let}}
  </template>
);
