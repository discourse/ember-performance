import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

export class BenchSelection extends Component {
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  selectAll = () => {
    this.queryParams.benchmarks.set(this.benchSession.availableBenchmarks);
  };

  selectNone = () => {
    this.queryParams.benchmarks.set([]);
  };

  toggle = (name: string) => {
    this.queryParams.benchmarks.toggle(name);
  };

  <template>
    <h4>
      Benchmarks:
      <button
        {{on "click" this.selectAll}}
        type="button"
        class="btn btn-default btn-xs"
      >All</button>
      <button
        {{on "click" this.selectNone}}
        type="button"
        class="btn btn-default btn-xs"
      >None</button>
    </h4>

    <div class="form-group">
      {{#each this.benchSession.availableBenchmarks as |name|}}
        <div>
          <label>

            <input
              type="checkbox"
              checked={{this.queryParams.benchmarks.hasItem name}}
              {{on "change" (fn this.toggle name)}}
            />

            {{name}}
          </label>
        </div>
      {{/each}}
    </div>
  </template>
}
