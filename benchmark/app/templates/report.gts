import { LinkTo } from '@ember/routing';

import { loadAll } from 'common';
import RouteTemplate from 'ember-route-template';

import BenchmarkReport from './components/benchmark-report';

export default RouteTemplate(
  <template>
    {{#let (loadAll) as |results|}}
      {{#if results}}
        <LinkTo @route="index">🠰 Back to Benchmarking</LinkTo>
        <BenchmarkReport @report={{results}} />
      {{else}}
        No results have been recorded yet. Run a benchmark to get started.

        <LinkTo @route="index">Run some tests</LinkTo>
      {{/if}}
    {{/let}}
  </template>
);
