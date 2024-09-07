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
    <div
      style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 1rem; align-items: start;"
    >
      <LinkTo @route="versions">Versions</LinkTo>

      &nbsp;&nbsp;&nbsp;

      <div>
        Embroider Builds
        <ul>
          <li>
            <ExternalLink href="https://ember-performance-testing-prod.pages.dev/?{{this.qps}}">
              Production
            </ExternalLink>
          </li><li>
            <ExternalLink href="https://ember-performance-testing-dev.pages.dev/?{{this.qps}}">
              Development
            </ExternalLink>
          </li>
        </ul>
      </div>
      <div>
        Broccoli Builds
        <ul>
          <li>
            <ExternalLink
              href="https://ember-performance-testing-prod-classic.pages.dev/?{{this.qps}}"
            >
              Production
            </ExternalLink>
          </li>
        </ul>
      </div>
      <ExternalLink href="https://github.com/nullvoxpopuli/ember-performance">
        GitHub
      </ExternalLink>
    </div>
  </template>
}
