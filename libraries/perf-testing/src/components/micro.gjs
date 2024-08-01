import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Layout } from './layout.gjs';
import { microBench } from './bench.js';
import { noop } from './consts.js';

export class MicroBenchmark extends Component {
  <template>
    <Layout @name={{@name}} @version={{@version}}>
      <:remaining>{{this.remaining}}</:remaining>
      <:status>{{this.status}}</:status>
      <:progress>{{this.progress}}</:progress>
      <:scratch></:scratch>
    </Layout
  </template>

  @tracked status;
  @tracked remaining;
  @tracked progress;

  run = () => {
    return microBench({
      name: this.args.name,

      fn: {
        test: this.args.test || noop,
        setup: this.args.test || noop,
        reset: this.args.test || noop,
        teardown: this.args.test || noop,
      },

      on: {
        start: () => {},
        status: (message) => (this.status = message),
        error: (message) => (this.status = message),
        finish: () => (),
      },
    });
  };
}
