// @ts-expect-error types-missing
import { LinkTo } from '@ember/routing';

import Route from 'ember-route-template';

import { Version } from '../components/version.gts';
import { scenarios } from '../scenarios.ts';

export default Route(
  <template>
    <h1>Run a benchmark</h1>
    <em>Using <Version /></em>

    <nav>
      <ul>
        {{#each-in scenarios as |name|}}
          <li><LinkTo @route="bench" @model={{name}}>{{name}}</LinkTo></li>
        {{/each-in}}
      </ul>
    </nav>
  </template>
);
