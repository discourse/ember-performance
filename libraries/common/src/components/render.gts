import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { use } from 'ember-resources';

import { OneOffTinyBench, type Options } from './bench.ts';
import { Layout } from './layout.gts';
import { store } from './storage.ts';
import { onRenderIsh } from './utils.ts';

import type ForAppVersion from '../services/runner/for-app-at-version.ts';

export class RenderBenchmark extends Component<{
  Args: {
    name: string;
  } & Omit<Options, 'test'>;
}> {
  @service('runner/for-app-at-version') declare forApp: ForAppVersion;

  @tracked status = '';
  @tracked remaining = '';
  @tracked progress = '';
  @tracked showContents = false;

  @use bench = OneOffTinyBench(() => ({
    options: {
      ...this.args,
      test: async () => {
        this.showContents = true;
        await new Promise((resolve) => requestIdleCallback(resolve));
      },
      teardown: async () => {
        this.showContents = false;

        await new Promise((resolve) => {
          requestAnimationFrame(resolve);
        });
      },
    },
    updateStatus: (msg: string) => (this.status = msg),
  }));

  isRunning = false;

  run = async () => {
    if (this.isRunning) {
      console.info('Already running');

      return;
    }

    this.isRunning = true;

    let bench = this.bench;
    let version = this.forApp.emberVersion;

    this.status = 'Warming up...';

    requestIdleCallback(async () => {
      await bench.warmup();

      this.status = 'Running...';
      requestIdleCallback(async () => {
        await bench.run();

        store(this.args.name, version, bench.results[0]);

        window.top.postMessage('finish');
      });
    });
  };

  <template>
    {{onRenderIsh this.run}}

    <Layout @name={{@name}} @version={{this.forApp.emberVersion}}>
      <:remaining>{{this.remaining}}</:remaining>
      <:status>{{this.status}}</:status>
      <:progress>{{this.progress}}</:progress>
      <:scratch>
        {{#if this.showContents}}
          {{yield}}
        {{/if}}
      </:scratch>
    </Layout>
  </template>
}
