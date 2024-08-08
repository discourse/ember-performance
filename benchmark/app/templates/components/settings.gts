import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { service } from '@ember/service';

import type { BenchSession } from 'common';
import type QueryParams from 'ember-performance/services/query-params';

export class Settings extends Component {
  @service declare queryParams: QueryParams;
  @service declare benchSession: BenchSession;

  toggle = () => {
    this.queryParams.clear.toggle();
  };

  <template>
    <fieldset>
      <legend>Settings</legend>

      <div class="form-group">
        <div>
          <label>

            <input
              type="checkbox"
              checked={{this.queryParams.clear.value}}
              {{on "change" this.toggle}}
            />

            Clear prior results
          </label>
        </div>
      </div>
    </fieldset>
  </template>
}
