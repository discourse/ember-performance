import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

export class Runner extends Component {
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  @tracked testUrl = '';
  @tracked isRunning = false;

  waiter?: (value?: unknown) => void;
  emitReady = () => {
    assert(`Cannot resume when there is no waiter`, this.waiter);
    this.waiter();
  };
  start = async () => {
    try {
      await Promise.resolve();
      this.isRunning = true;

      let remainingVersions = [...this.queryParams.emberVersions.value];
      let remainingTests = [...this.queryParams.benchmarks.value];

      while (remainingVersions.length) {
        let current = remainingVersions.pop();

        let testsForVersion = [...remainingTests];

        while (testsForVersion.length) {
          let bench = testsForVersion.pop();

          let promise = new Promise((resolve) => (this.waiter = resolve));

          this.testUrl = `/ember-${current.replace('.', '-')}/${bench}`;

          await promise;

          // eslint-disable-next-line
          console.log('loaded!');

          /**
           * Load iframe
           * wait for onload
           * send start command
           * wait for finish
           * set next URL
           */
        }
      }
    } finally {
      this.isRunning = false;
    }
  };
  get canStart() {
    return !this.isRunning;
  }

  get cannotStart() {
    return !this.canStart;
  }

  <template>
    <div class="footer">
      <button
        type="button"
        class="btn btn-primary"
        {{on "click" this.start}}
        disabled={{this.cannotStart}}
      >Run Tests</button>
    </div>

    {{#if this.testUrl}}
      <iframe
        title="Current Test"
        src={{this.testUrl}}
        style="width: 100%; min-height: 600px;"
        {{on "load" this.emitReady}}
      ></iframe>
    {{/if}}
  </template>
}
