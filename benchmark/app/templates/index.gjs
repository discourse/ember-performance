import { Input } from '@ember/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

import RouteTemplate from 'ember-route-template';

import { VersionSelection } from './components/version-selection';
import { BenchSelection } from './components/bench-selection';
import { Runner } from './components/runner';

export default RouteTemplate(
  <template>
    <div style="display: flex; gap: 1rem;">
      <BenchSelection />
      <VersionSelection />
    </div>
    <Runner />
  </template>
);
