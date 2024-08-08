import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import { pageTitle } from 'ember-page-title';
import Route from 'ember-route-template';

import type ForAppVersion from '../services/runner/for-app-version';

export default Route(
  class extends Component {
    @service('runner/for-app-at-version') declare forApp: ForAppVersion;

    get title() {
      return `Ember ${this.forApp.emberVersion}`;
    }

    <template>
      {{pageTitle this.title}}

      {{outlet}}
    </template>
  }
);
