import { LinkTo } from '@ember/routing';

import RouteTemplate from 'ember-route-template';

import { BenchSelection } from './components/bench-selection';
import { Runner } from './components/runner';
import { Settings } from './components/settings';
import { VersionSelection } from './components/version-selection';

export default RouteTemplate(
  <template>
    <LinkTo @route="report">View Report</LinkTo>
    <Runner />
    <div style="display: flex; gap: 1rem;">
      <Settings />
      <BenchSelection />
      <VersionSelection />
    </div>
  </template>
);
