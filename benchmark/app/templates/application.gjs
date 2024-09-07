import Component from '@glimmer/component';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';

import { pageTitle } from 'ember-page-title';
import RouteTemplate from 'ember-route-template';

import { ExternalLink } from './components/external-link';

export default RouteTemplate(
  <template>
    {{pageTitle "Ember Performance Benchmarks"}}

    <div class="container">
      <h3 class="text-muted">Ember Performance</h3>
      <TopLinks />

      {{outlet}}
    </div>
  </template>
);

class TopLinks extends Component {
  @service router;

  get qps() {
    return new URLSearchParams(this.router.currentRoute?.queryParams || {});
  }

  <template>
    <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 1rem;">
      <LinkTo @route="versions">Versions</LinkTo>

      &nbsp;&nbsp;&nbsp;

      <ExternalLink href="https://ember-performance-testing-prod.pages.dev/?{{this.qps}}">
        Prod (embroider) Tests
      </ExternalLink>
      <ExternalLink href="https://ember-performance-testing-dev.pages.dev/?{{this.qps}}">
        Dev (embroider) Tests
      </ExternalLink>
      <ExternalLink href="https://ember-performance-testing-prod-classic.pages.dev/?{{this.qps}}">
        Prod (classic) Tests
      </ExternalLink>
      <ExternalLink href="https://github.com/nullvoxpopuli/ember-performance">
        GitHub
      </ExternalLink>
    </div>
  </template>
}
