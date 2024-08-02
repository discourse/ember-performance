import Route from '@ember/routing/route';
import { service } from '@ember/service';

import config from 'ember-performance/config/environment';
import { TrackedArray } from 'tracked-built-ins';

const BENCHMARKS = config.BENCHMARKS;

const EMBER_VERSIONS = config.LOCAL_EMBER_VERSIONS.map((version) => {
  return {
    name: version,
    path: `/ember/ember-${version}.prod.js`,
    compilerPath: `/ember/ember-${version}.template-compiler.js`,
    isEnabled: false,
    isCustom: false,
  };
});

EMBER_VERSIONS[EMBER_VERSIONS.length - 1].isEnabled = true;

EMBER_VERSIONS.push({
  name: 'custom version',
  path: '',
  compilerPath: '',
  isEnabled: false,
  isCustom: true,
});

export default class IndexRoute extends Route {
  @service benchSession;

  model() {
    this.benchSession.recover();
  }
}
