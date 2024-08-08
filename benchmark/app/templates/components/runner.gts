import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import { clearAll } from 'common';

import type RouterService from '@ember/routing/router-service';
import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

export class Runner extends Component {
  @service declare router: RouterService;
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  @tracked testUrl = '';
  @tracked isRunning = false;

  waiter?: (value?: unknown) => void;
  currentIframeWindow?: Window | null;
  emitReady = (event: Event) => {
    assert(`event.target cannot be null`, event.target);
    assert(`event.target must be an iframe element`, event.target instanceof HTMLIFrameElement);

    let win = event.target.contentWindow;

    this.currentIframeWindow = win;
    assert(`Cannot resume when there is no waiter`, this.waiter);

    this.waiter();
  };
  start = async () => {
    try {
      await Promise.resolve();
      this.isRunning = true;

      if (this.queryParams.clear.value) {
        this.queryParams.clear.toggle();
        clearAll();
      }

      let remainingVersions = [...this.queryParams.emberVersions.value];
      let remainingTests = [...this.queryParams.benchmarks.value];

      while (remainingVersions.length) {
        let current = remainingVersions.pop();

        let testsForVersion = [...remainingTests];

        while (testsForVersion.length) {
          let bench = testsForVersion.pop();

          let promise = new Promise((resolve) => (this.waiter = resolve));

          let { protocol, host } = window.location;

          this.testUrl = `${protocol}//${host}/ember-${current.replace(
            '.',
            '-'
          )}/index.html?run=${bench}`;

          await promise;

          assert(`Could not determine iframe for test`, this.currentIframeWindow);

          let finish: (v?: unknown) => void;
          let finishPromise = new Promise((resolve) => (finish = resolve));

          // eslint-disable-next-line
          function waitForFinish(event: MessageEvent) {
            if (event.data === 'finish') {
              window.removeEventListener('message', waitForFinish);
              finish();
            }
          }

          window.addEventListener('message', waitForFinish);
          this.currentIframeWindow.postMessage(JSON.stringify(['run', bench]));

          await finishPromise;
        }
      }
    } finally {
      this.isRunning = false;
      this.router.transitionTo('report');
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
