import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

import AreaChart from './area-chart';
import { formatNumber } from './utils';

export default class BenchmarkReport extends Component {
  get showGraph() {
    return this.args.report.length > 1;
  }

  chartOptions = {
    title: 'Time (ms) (lower is better)',
    hAxis: {
      title: 'Ember Version',
    },
    intervals: { style: 'area' },
    legend: 'none',
  };

  get groupedTests() {
    const tests = {};

    for (let data of this.args.report) {
      let { name, results, version } = data;
      let result = results;

      const test = tests[name] || {
        name: name,
        data: [],
        chartData: [
          [
            'Ember Version',
            'Time in ms (lower is better)',
            { role: 'interval' },
            { role: 'interval' },
          ],
        ],
      };

      test.data.push({
        emberVersion: version,
        result,
      });

      test.chartData.push({
        emberVersion: version,
        mean: result.mean,
        margin_error_lower: Math.max(result.mean - (result.mean * result.rme) / 100, 0),
        margin_error_upper: result.mean + (result.mean * result.rme) / 100,
      });

      tests[name] = test;
    }

    return tests;
  }

  <template>
    <h4>Results:</h4>

    {{#each-in this.groupedTests as |name test|}}
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title">{{test.name}}</h3>
        </div>
        <div class="panel-body">
          {{#if this.showGraph}}
            <AreaChart @data={{test.chartData}} @options={{this.chartOptions}} />
          {{/if}}
          <table class="table table-striped table-hover table-condensed table-responsive">
            <thead>
              <tr>
                <th>Name</th>
                <th class="numeric">Speed</th>
                <th class="numeric">Error</th>
                <th class="numeric">Samples</th>
                <th class="numeric">Mean</th>
              </tr>
            </thead>
            <tbody>
              {{#each test.data as |item|}}
                <tr>
                  <td>
                    <strong>{{test.name}}</strong>
                    <span class="label label-primary">{{item.emberVersion}}</span>
                  </td>
                  <td class="numeric">{{formatNumber
                      item.result.hz
                      minimumFractionDigits=2
                      maximumFractionDigits=2
                    }}
                    / sec
                  </td>
                  <td class="numeric">&#x2213;
                    {{formatNumber
                      item.result.rme
                      minimumFractionDigits=2
                      maximumFractionDigits=2
                    }}%
                  </td>
                  <td class="numeric">{{item.result.numSamples}}</td>
                  <td class="numeric">{{formatNumber item.result.mean mode="auto"}}
                    ms
                  </td>
                </tr>
              {{/each}}
            </tbody>
          </table>
        </div>
      </div>
    {{/each-in}}

    <hr />
  </template>
}
