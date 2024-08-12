import ENV from 'ember-performance/config/environment';
import RouteTemplate from 'ember-route-template';

import { ExternalLink } from './components/external-link';

const { LOCAL_EMBER_VERSIONS } = ENV;

function toUrl(version) {
  let name = version.replace('.', '-');

  return `${location.protocol}//${location.host}/${name}/`;
}

export default RouteTemplate(
  <template>
  <p>These are links to direct-interact with each of the ember versions this project tests with/against. By navigating directly to an app, you'll be able to run browser perf inspecting tools.</p>

  <nav>
    <ul>
      {{#each LOCAL_EMBER_VERSIONS as |version|}}
        <li>
          <ExternalLink href={{toUrl version}}>
            {{version}}
          </ExternalLink>
        </li>
      {{/each}}
    </ul>
  </nav>

  </template>
);
