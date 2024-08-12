import Component from '@glimmer/component';
import { service } from '@ember/service';

import { pageTitle } from 'ember-page-title';
import { ExternalLink } from 'ember-primitives/components/external-link';
import RouteTemplate from 'ember-route-template';

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
    <div style="position: absolute; top: 0.5rem; right: 0.5rem;">
      <ExternalLink href="https://ember-performance-testing-prod.pages.dev/?{{this.qps}}">Production Tests</ExternalLink> --
      <ExternalLink href="https://ember-performance-testing-dev.pages.dev/?{{this.qps}}">Development Tests</ExternalLink> --
      <ExternalLink href="https://github.com/nullvoxpopuli/ember-performance">GitHub</ExternalLink>
    </div>
  </template>
}
