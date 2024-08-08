import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import type ForAppVersion from '../services/runner/for-app-at-version.ts';

export class Version extends Component {
  @service('runner/for-app-at-version') declare forApp: ForAppVersion;

  <template>{{this.forApp.emberVersion}}</template>
}
