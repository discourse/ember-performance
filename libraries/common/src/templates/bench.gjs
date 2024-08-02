import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import { LinkTo } from '@ember/routing';

import Route from 'ember-route-template';

import { scenarios } from '../scenarios.js';

function get(name) {
  return scenarios[name];
}

class Index extends Component {
  get env() {
    let env = getOwner(this).resolveRegistration('config:environment');

    return env;
  }

  get emberSource() {
    let versionSpecifier = this.env.deps['ember-source'];

    let cleaned = versionSpecifier.replace(/(\^|~|>=|<|>|<=)/, '');

    return cleaned;
  }

  <template>
    <LinkTo @route="index">🠰 Benchmark List</LinkTo>

    {{#let (get @model.name) as |Scenario|}}
      <Scenario @version={{this.emberSource}} />
    {{/let}}
  </template>
}

export default Route(Index);
