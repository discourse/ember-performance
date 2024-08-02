import { LinkTo } from '@ember/routing';

import Route from 'ember-route-template';

import { scenarios } from '../scenarios.js';

export default Route(
  <template>
    <h1>Run a benchmark</h1>

    <nav>
      <ul>
        {{#each-in scenarios as |name|}}
          <li><LinkTo @route="bench" @model={{name}}>{{name}}</LinkTo></li>
        {{/each-in}}
      </ul>
    </nav>
  </template>
);
