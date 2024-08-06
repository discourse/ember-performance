import { LinkTo } from '@ember/routing';

import RouteTemplate from 'ember-route-template';

import { BenchSelection } from './components/bench-selection';
import { Runner } from './components/runner';
import { VersionSelection } from './components/version-selection';

export default RouteTemplate(
  <template>
    <LinkTo @route="report">View Report</LinkTo>
    <div style="display: flex; gap: 1rem;">
      <BenchSelection />
      <VersionSelection />
    </div>
    <Runner />
  </template>
);
