import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { use } from 'ember-resources';

import { OneOffTinyBench, type Options } from './bench.ts';
import { Layout } from './layout.gts';
import { store } from './storage.ts';
import { onRenderIsh } from './utils.ts';

export class MicroBenchmark extends Component<{
  Args: {
    name: string;
    version: string;
  } & Options;
}> {
  @tracked status = '';
  @tracked remaining = '';
  @tracked progress = '';

  @use bench = OneOffTinyBench(() => ({
    options: this.args,
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

    this.status = 'Warming up...';

    requestIdleCallback(async () => {
      await bench.warmup();

      this.status = 'Running...';
      requestIdleCallback(async () => {
        await bench.run();

        store(this.args.name, this.args.version, bench.results[0]);
      });
    });
  };

  <template>
    {{onRenderIsh this.run}}

    <Layout @name={{@name}} @version={{@version}}>
      <:remaining>{{this.remaining}}</:remaining>
      <:status>{{this.status}}</:status>
      <:progress>{{this.progress}}</:progress>
      <:scratch></:scratch>
    </Layout>
  </template>
}
