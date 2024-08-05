import { Input } from '@ember/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

import RouteTemplate from 'ember-route-template';

import { VersionSelection } from './components/version-selection';
import { BenchSelection } from './components/bench-selection';

export default RouteTemplate(
  <template>
    <BenchSelection />
    <VersionSelection />

    <div class="footer">
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" @controller.start}}
        disabled={{@controller.cantStart}}
      >Run Tests</button>
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" @controller.profile}}
        disabled={{@controller.cantStart}}
      >Run Tests with Profile</button>
    </div>
  </template>
);
